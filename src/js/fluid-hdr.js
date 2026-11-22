// The simulation stays in WebGL. Only the final, opaque frame crosses to WebGPU.
function createFluidHDROutput(source) {
	const display = window.matchMedia('(dynamic-range: high)');
	let active = null;
	let generation = 0;

	function reset() {
		generation++;
		if (active) {
			active.canvas.remove();
			active.context.unconfigure();
			if (active.texture) active.texture.destroy();
			active.device.destroy();
			active = null;
		}
	}

	async function configure() {
		reset();
		if (!display.matches || !navigator.gpu) return;
		const current = generation;
		let device;
		try {
			const output = document.createElement('canvas');
			const context = output.getContext('webgpu');
			if (!context || !context.getConfiguration) return;
			const adapter = await navigator.gpu.requestAdapter();
			if (!adapter || current !== generation) return;
			device = await adapter.requestDevice();
			context.configure({
				device, format: 'rgba16float', colorSpace: 'srgb',
				alphaMode: 'opaque', toneMapping: { mode: 'extended' }
			});
			const settings = context.getConfiguration();
			if (!settings || !settings.toneMapping || settings.toneMapping.mode !== 'extended') return;

			const module = device.createShaderModule({ code: `
				@vertex fn vertexMain(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f {
					let xy = vec2f(f32((i << 1u) & 2u), f32(i & 2u));
					return vec4f(xy * 2.0 - 1.0, 0.0, 1.0);
				}

				@group(0) @binding(0) var frame: texture_2d<f32>;
				@fragment fn fragmentMain(@builtin(position) pixel: vec4f) -> @location(0) vec4f {
					// WebGL halves the final sRGB signals before the 8-bit transfer.
					let rgb = textureLoad(frame, vec2i(pixel.xy), 0).rgb * 2.0;
					return vec4f(rgb, 1.0);
				}
			` });
			const pipeline = await device.createRenderPipelineAsync({
				layout: 'auto',
				vertex: { module, entryPoint: 'vertexMain' },
				fragment: { module, entryPoint: 'fragmentMain', targets: [{ format: 'rgba16float' }] }
			});
			if (current !== generation) return;
			output.className = 'fluid-hdr-output';
			output.setAttribute('aria-hidden', 'true');
			active = { canvas: output, context, device, pipeline };
			const onFailure = () => { if (current === generation) reset(); };
			device.lost.then(onFailure);
			device.addEventListener('uncapturederror', onFailure);
		} catch (error) {
			// The ordinary WebGL canvas remains visible if HDR setup fails.
		} finally {
			if (device && (!active || active.device !== device)) device.destroy();
		}
	}

	function present() {
		const { canvas, context, device, pipeline } = active;
		try {
			if (!active.texture || canvas.width !== source.width || canvas.height !== source.height) {
				canvas.width = source.width;
				canvas.height = source.height;
				if (active.texture) active.texture.destroy();
				active.texture = device.createTexture({
					size: [canvas.width, canvas.height], format: 'rgba8unorm',
					usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT
				});
				active.bindGroup = device.createBindGroup({
					layout: pipeline.getBindGroupLayout(0),
					entries: [{ binding: 0, resource: active.texture.createView() }]
				});
			}
			device.queue.copyExternalImageToTexture({ source }, {
				texture: active.texture, colorSpace: 'srgb', premultipliedAlpha: true
			}, [canvas.width, canvas.height]);
			const encoder = device.createCommandEncoder();
			const pass = encoder.beginRenderPass({ colorAttachments: [{
				view: context.getCurrentTexture().createView(), loadOp: 'clear', storeOp: 'store',
				clearValue: [0, 0, 0, 1]
			}] });
			pass.setPipeline(pipeline);
			pass.setBindGroup(0, active.bindGroup);
			pass.draw(3);
			pass.end();
			device.queue.submit([encoder.finish()]);
			if (!canvas.parentNode) source.after(canvas);
			return true;
		} catch (error) {
			reset();
			return false;
		}
	}

	display.addListener(configure);
	configure();
	return {
		get enabled() { return !!active; },
		present,
		dispose() {
			display.removeListener(configure);
			reset();
		}
	};
}

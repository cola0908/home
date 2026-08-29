import { cp, mkdir, rm } from "node:fs/promises";
import { spawn } from "node:child_process";

const runCheck = () => new Promise((resolve, reject) => {
  const child = spawn(process.execPath, ["scripts/check.mjs"], { stdio: "inherit" });
  child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error("项目检查未通过"))));
});

await runCheck();
await rm("dist", { recursive: true, force: true });
await mkdir("dist/src", { recursive: true });
await cp("index.html", "dist/index.html");
await cp("src", "dist/src", { recursive: true });

console.log("构建完成：静态文件已输出到 dist/。");

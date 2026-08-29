import { readFile } from "node:fs/promises";

const requiredFiles = ["index.html", "src/main.js", "src/profile.js", "src/styles.css"];
const contents = Object.fromEntries(
  await Promise.all(requiredFiles.map(async (file) => [file, await readFile(file, "utf8")])),
);

const checks = [
  [contents["index.html"].includes('lang="zh-CN"'), "页面语言应为简体中文"],
  [(contents["index.html"].match(/<meta /g) || []).length >= 6, "应包含基础 SEO 与社交元信息"],
  [(contents["src/main.js"].match(/<h1[\s>]/g) || []).length === 1, "页面应仅包含一个 h1"],
  [contents["src/main.js"].includes("<a class=\"dialog-link"), "外部入口应使用真实 a 元素"],
  [contents["src/main.js"].includes("aria-label=\"切换至深色模式\""), "主题按钮应包含准确的 aria-label"],
  [contents["src/styles.css"].includes("prefers-reduced-motion"), "应支持减少动画设置"],
  [contents["src/styles.css"].includes("@media (max-width: 559px)"), "应包含移动端单列断点"],
  [contents["src/styles.css"].includes(":focus-visible"), "应包含键盘焦点样式"],
];

const requiredProfileFields = [
  "name",
  "handle",
  "bio",
  "status",
  "avatar",
  "blogUrl",
  "githubUrl",
];

for (const field of requiredProfileFields) {
  checks.push([new RegExp(`\\b${field}\\s*:`).test(contents["src/profile.js"]), `个人资料缺少 ${field}`]);
}

const failures = checks.filter(([passed]) => !passed).map(([, message]) => message);

if (failures.length) {
  console.error(`检查失败：\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`检查通过：${checks.length} 项结构、主题、响应式与可访问性规则。`);

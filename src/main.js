import { profile } from "./profile.js";

const app = document.querySelector("#app");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
const themePreferenceKey = "profile-theme-preference";

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const icons = {
  about: `
    <svg viewBox="0 0 80 72" aria-hidden="true">
      <path d="M13 10h45a10 10 0 0 1 10 10v25a10 10 0 0 1-10 10H34L18 66l3-11h-8A10 10 0 0 1 3 45V20A10 10 0 0 1 13 10Z" />
      <circle cx="35" cy="25" r="3" />
      <path d="M35 34v12M29 46h12" />
    </svg>`,
  blog: `
    <svg viewBox="0 0 80 72" aria-hidden="true">
      <path d="M14 8h43a9 9 0 0 1 9 9v42H20a9 9 0 0 1-9-9V11a3 3 0 0 1 3-3Z" />
      <path d="M20 59a8 8 0 0 1 0-16h46M24 20h28M24 29h22" />
      <path d="m51 39 10-10 5 5-10 10-8 3 3-8Z" />
    </svg>`,
  github: `
    <svg class="github-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 .7a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.26c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .7Z" />
    </svg>`,
};

const apps = [
  { id: "about", label: "关于", icon: icons.about },
  { id: "blog", label: "博客", icon: icons.blog },
  { id: "github", label: "GitHub", icon: icons.github },
];

const appButton = ({ id, label, icon }) => `
  <button class="desktop-app" type="button" data-window-open="${id}" aria-label="打开${label}窗口">
    <span class="desktop-app__icon">${icon}</span>
    <span class="desktop-app__label">${label}</span>
  </button>`;

const jellyfish = `
  <svg class="sea-friend" viewBox="0 0 130 118" aria-hidden="true">
    <ellipse cx="65" cy="104" rx="45" ry="8" />
    <path d="M30 62c0-25 15-43 35-43s35 18 35 43H30Z" />
    <path d="M34 62c2 11 8 18 15 18 7 0 9-7 16-7s9 7 16 7c7 0 13-7 15-18" />
    <path d="M47 78c0 12-6 18-1 25M65 74c0 12-5 20 0 29M83 78c0 12 6 18 1 25" />
    <circle cx="53" cy="49" r="2" /><circle cx="77" cy="49" r="2" />
    <path d="M58 57c4 3 10 3 14 0" />
  </svg>`;

app.innerHTML = `
  <div class="desktop-scene">
    <header class="utility-bar">
      <button class="theme-toggle" type="button" aria-label="切换至深色模式" aria-pressed="false">
        <svg class="theme-icon theme-icon--sun" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
        </svg>
        <svg class="theme-icon theme-icon--moon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 15.2A8.5 8.5 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z" />
        </svg>
      </button>
    </header>

    <main class="desktop-main">
      <div class="desktop-badge" aria-hidden="true">
        <img src="${escapeHtml(profile.avatar)}" alt="" />
      </div>

      <section class="home-window" aria-labelledby="profile-name">
        <header class="window-titlebar">
          <span>home</span>
          <span class="window-titlebar__signal" aria-hidden="true"><i></i></span>
        </header>
        <div class="home-window__content">
          <h1 id="profile-name"><span>你好，我是</span> ${escapeHtml(profile.name)}</h1>
          <p class="home-window__bio">${escapeHtml(profile.bio)}</p>
          <p class="home-window__status">${escapeHtml(profile.status)}</p>
          <nav class="desktop-apps" aria-label="个人入口">
            ${apps.map(appButton).join("")}
          </nav>
        </div>
      </section>
    </main>

    <div class="sea-layer" aria-hidden="true"></div>
    ${jellyfish}

    <footer class="desktop-footer">
      <p>© ${new Date().getFullYear()} ${escapeHtml(profile.name)}</p>
    </footer>

    <dialog class="child-window" aria-labelledby="child-window-title">
      <header class="child-window__titlebar">
        <span id="child-window-title">窗口</span>
        <button type="button" class="child-window__close" aria-label="关闭窗口">[×]</button>
      </header>
      <div class="child-window__content"></div>
    </dialog>
  </div>`;

const dialog = document.querySelector(".child-window");
const dialogTitle = document.querySelector("#child-window-title");
const dialogContent = document.querySelector(".child-window__content");
const closeDialog = document.querySelector(".child-window__close");
const themeToggle = document.querySelector(".theme-toggle");
const homeWindow = document.querySelector(".home-window");
const desktopViewport = window.matchMedia("(min-width: 560px)");

const makeDraggable = (windowElement, handle) => {
  const position = { x: 0, y: 0 };
  let drag = null;

  const renderPosition = () => {
    windowElement.style.setProperty("--drag-x", `${position.x}px`);
    windowElement.style.setProperty("--drag-y", `${position.y}px`);
  };

  const keepInViewport = () => {
    if (!desktopViewport.matches || (windowElement instanceof HTMLDialogElement && !windowElement.open)) return;
    const rect = windowElement.getBoundingClientRect();
    const edge = 8;
    const correctionX = rect.left < edge
      ? edge - rect.left
      : rect.right > window.innerWidth - edge
        ? window.innerWidth - edge - rect.right
        : 0;
    const correctionY = rect.top < edge
      ? edge - rect.top
      : rect.bottom > window.innerHeight - edge
        ? window.innerHeight - edge - rect.bottom
        : 0;

    if (correctionX || correctionY) {
      position.x += correctionX;
      position.y += correctionY;
      renderPosition();
    }
  };

  const stopDragging = (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    drag = null;
    windowElement.classList.remove("is-dragging");
    if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
  };

  handle.addEventListener("pointerdown", (event) => {
    if (!desktopViewport.matches || (event.pointerType === "mouse" && event.button !== 0)) return;
    if (event.target.closest("button, a, input, textarea, select")) return;

    const rect = windowElement.getBoundingClientRect();
    drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
      rect,
    };
    handle.setPointerCapture(event.pointerId);
    windowElement.classList.add("is-dragging");
    event.preventDefault();
  });

  handle.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const deltaX = Math.min(
      Math.max(event.clientX - drag.startX, 8 - drag.rect.left),
      window.innerWidth - 8 - drag.rect.right,
    );
    const deltaY = Math.min(
      Math.max(event.clientY - drag.startY, 8 - drag.rect.top),
      window.innerHeight - 8 - drag.rect.bottom,
    );
    position.x = drag.originX + deltaX;
    position.y = drag.originY + deltaY;
    renderPosition();
  });

  handle.addEventListener("pointerup", stopDragging);
  handle.addEventListener("pointercancel", stopDragging);
  window.addEventListener("resize", keepInViewport);
  desktopViewport.addEventListener("change", (event) => {
    if (event.matches) {
      keepInViewport();
      return;
    }
    position.x = 0;
    position.y = 0;
    renderPosition();
  });

  return keepInViewport;
};

makeDraggable(homeWindow, homeWindow.querySelector(".window-titlebar"));
const keepDialogInViewport = makeDraggable(dialog, dialog.querySelector(".child-window__titlebar"));

const dialogViews = {
  about: {
    title: "关于",
    content: `
      <div class="about-view">
        <img class="about-view__avatar" src="${escapeHtml(profile.avatar)}" alt="${escapeHtml(profile.name)} 的头像" />
        <div>
          <h2>${escapeHtml(profile.name)}</h2>
          <p class="about-view__handle">${escapeHtml(profile.handle)}</p>
          <p>${escapeHtml(profile.bio)}</p>
          <p class="about-view__quote">“${escapeHtml(profile.status)}”</p>
        </div>
      </div>`,
  },
  blog: {
    title: "个人博客",
    content: `
      <div class="link-view">
        <span class="link-view__icon">${icons.blog}</span>
        <div>
          <h2>个人博客</h2>
          <p>阅读我的思考、笔记与长期沉淀。</p>
          <a class="dialog-link" href="${escapeHtml(profile.blogUrl)}" target="_blank" rel="noreferrer">打开博客 <span>↗</span></a>
        </div>
      </div>`,
  },
  github: {
    title: "GitHub",
    content: `
      <div class="link-view">
        <span class="link-view__icon">${icons.github}</span>
        <div>
          <h2>GitHub</h2>
          <p>查看代码、实验与持续构建中的想法。</p>
          <a class="dialog-link" href="${escapeHtml(profile.githubUrl)}" target="_blank" rel="noreferrer">打开 GitHub <span>↗</span></a>
        </div>
      </div>`,
  },
};

const openWindow = (viewName) => {
  const view = dialogViews[viewName];
  if (!view) return;
  dialogTitle.textContent = view.title;
  dialogContent.innerHTML = view.content;
  if (!dialog.open) dialog.showModal();
  requestAnimationFrame(keepDialogInViewport);
};

document.querySelectorAll("[data-window-open]").forEach((button) => {
  button.addEventListener("click", () => openWindow(button.dataset.windowOpen));
});

closeDialog.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

const getTheme = () => document.documentElement.dataset.theme || (systemTheme.matches ? "dark" : "light");

const updateThemeButton = () => {
  const isDark = getTheme() === "dark";
  const followsSystem = document.documentElement.dataset.themeMode !== "manual";
  themeToggle.setAttribute("aria-label", isDark ? "切换至浅色模式" : "切换至深色模式");
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.title = followsSystem ? "当前跟随系统" : "当前为手动模式，再次切换可恢复跟随系统";
};

const setTheme = (theme, mode = "manual") => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.themeMode = mode;
  document.documentElement.style.colorScheme = theme;
  try {
    if (mode === "manual") {
      localStorage.setItem(themePreferenceKey, theme);
    } else {
      localStorage.removeItem(themePreferenceKey);
    }
  } catch {
    // 存储不可用时仍保留本次会话的主题。
  }
  updateThemeButton();
};

themeToggle.addEventListener("click", () => {
  const nextTheme = getTheme() === "dark" ? "light" : "dark";
  const currentSystemTheme = systemTheme.matches ? "dark" : "light";
  setTheme(nextTheme, nextTheme === currentSystemTheme ? "system" : "manual");
});

const handleSystemThemeChange = (event) => {
  const nextSystemTheme = event.matches ? "dark" : "light";
  if (document.documentElement.dataset.themeMode === "manual") {
    if (getTheme() === nextSystemTheme) setTheme(nextSystemTheme, "system");
    return;
  }
  setTheme(nextSystemTheme, "system");
};

if (typeof systemTheme.addEventListener === "function") {
  systemTheme.addEventListener("change", handleSystemThemeChange);
} else {
  systemTheme.addListener(handleSystemThemeChange);
}

document.title = `${profile.name} · 个人主页`;
updateThemeButton();

type Theme = "light" | "dark";
function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* Allow theme switching when browser storage is blocked. */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}
function initTheme() {
  const theme = getInitialTheme();
  applyTheme(theme);
  return theme;
}
function toggleTheme(): Theme {
  const theme = getCurrentTheme() === "dark" ? "light" : "dark";
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* Apply the theme on this page even if saving fails. */
  }
  applyTheme(theme);
  return theme;
}
function getCurrentTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}
export { initTheme, toggleTheme, getCurrentTheme, applyTheme };

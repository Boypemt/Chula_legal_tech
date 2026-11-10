const STORAGE_KEY = "clt-theme";

function readStored() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    // Private mode or blocked storage — fall back to the system theme.
    return null;
  }
}

function store(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Ignore: the theme still applies for this page view.
  }
}

function systemTheme() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function apply(theme, icon) {
  document.documentElement.dataset.theme = theme;
  if (icon) icon.textContent = theme === "dark" ? "☾" : "☀";
}

/**
 * Wires up the theme toggle button and restores any saved preference.
 */
export function initTheme() {
  const button = document.querySelector("[data-theme-toggle]");
  const icon = document.querySelector("[data-theme-icon]");

  let theme = readStored() ?? systemTheme();
  apply(theme, icon);

  button?.addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    apply(theme, icon);
    store(theme);
  });
}

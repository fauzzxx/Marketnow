const THEME_KEY = "theme";

export type Theme = "light" | "dark" | "system";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem(THEME_KEY) as Theme) || "system";
}

export function setStoredTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  const resolved = theme === "system" ? getSystemTheme() : theme;
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

export function getResolvedTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

import { useEffect, useState } from "react";

export type Theme = "midnight" | "claro";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem("dcss_theme") as Theme | null;
      return saved === "claro" ? "claro" : "midnight";
    } catch {
      return "midnight";
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "claro") {
      root.classList.add("theme-claro");
      root.classList.remove("dark");
    } else {
      root.classList.remove("theme-claro");
      root.classList.add("dark");
    }
    try {
      localStorage.setItem("dcss_theme", theme);
    } catch {
      /* noop */
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "midnight" ? "claro" : "midnight"));
  }

  return { theme, setTheme, toggleTheme };
}

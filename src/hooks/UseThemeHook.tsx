import { useState, useEffect, useCallback } from "react";
import { THEME_KEY } from "../utils/helper";

const useTheme = () => {
  const lazyInit = () => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") return stored;
    const ask = window.confirm(
      "Use dark theme? Click OK for dark, Cancel for light."
    );
    const t = ask ? "dark" : "light";
    localStorage.setItem(THEME_KEY, t);
    return t;
  };
  const [theme, setTheme] = useState<"dark" | "light">(lazyInit);

  useEffect(() => {
    document.body.classList.remove("theme-dark", "theme-light");
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  }, []);

  return { theme, toggleTheme };
};

export default useTheme;

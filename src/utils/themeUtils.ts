export const getInitialTheme = () => localStorage.getItem("theme") === "dark";
export const saveThemePreference = (dark: boolean) =>
  localStorage.setItem("theme", dark ? "dark" : "light");

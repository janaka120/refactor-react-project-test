import { describe, it, expect, beforeEach } from "vitest";
import { getInitialTheme, saveThemePreference } from "../themeUtils"; // adjust path

describe("theme prefs helpers", () => {
  beforeEach(() => localStorage.clear());

  describe("getInitialTheme", () => {
    it("returns true when stored value is 'dark'", () => {
      localStorage.setItem("theme", "dark");
      expect(getInitialTheme()).toBe(true);
    });

    it("returns false when stored value is 'light'", () => {
      localStorage.setItem("theme", "light");
      expect(getInitialTheme()).toBe(false);
    });

    it("returns false when nothing stored", () => {
      expect(getInitialTheme()).toBe(false);
    });
  });

  describe("saveThemePreference", () => {
    it("stores 'dark' when passed true", () => {
      saveThemePreference(true);
      expect(localStorage.getItem("theme")).toBe("dark");
    });

    it("stores 'light' when passed false", () => {
      saveThemePreference(false);
      expect(localStorage.getItem("theme")).toBe("light");
    });
  });
});

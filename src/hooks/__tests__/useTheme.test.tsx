import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { THEME_KEY } from "../../utils/helper";
import useTheme from "../UseThemeHook";

describe("useTheme", () => {
  const removeAllThemeClasses = () => {
    document.body.classList.remove("theme-dark", "theme-light");
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    removeAllThemeClasses();
  });

  afterEach(() => {
    removeAllThemeClasses();
  });

  it("uses stored theme without asking the user", () => {
    localStorage.setItem(THEME_KEY, "dark");
    const confirmSpy = vi.spyOn(window, "confirm");

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("dark");
    expect(document.body).toHaveClass("theme-dark");
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it("asks user if no theme stored, saves and applies it (confirm = true => dark)", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    const { result } = renderHook(() => useTheme());

    expect(confirmSpy).toHaveBeenCalled();
    expect(result.current.theme).toBe("dark");
    expect(localStorage.getItem(THEME_KEY)).toBe("dark");
    expect(document.body).toHaveClass("theme-dark");
  });

  it("asks user if no theme stored, saves and applies it (confirm = false => light)", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

    const { result } = renderHook(() => useTheme());

    expect(confirmSpy).toHaveBeenCalled();
    expect(result.current.theme).toBe("light");
    expect(localStorage.getItem(THEME_KEY)).toBe("light");
    expect(document.body).toHaveClass("theme-light");
  });

  it("toggleTheme switches theme, updates DOM and localStorage", () => {
    localStorage.setItem(THEME_KEY, "dark");
    renderHook(() => useTheme()); // first hook to add initial class
    removeAllThemeClasses(); // ensure we verify class is added again

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("dark");
    expect(document.body).toHaveClass("theme-dark");

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("light");
    expect(localStorage.getItem(THEME_KEY)).toBe("light");
    expect(document.body).toHaveClass("theme-light");
    expect(document.body).not.toHaveClass("theme-dark");
  });
});

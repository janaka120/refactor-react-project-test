import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { isLoggedIn, logoutIfInactive } from "../authUtils";

const TEN_MIN = 1000 * 60 * 10;

describe("authUtils", () => {
  let reloadSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    reloadSpy = vi.fn();
    // jsdom doesn't define reload as writable, so redefine it
    Object.defineProperty(window, "location", {
      value: { reload: reloadSpy },
      writable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  describe("isLoggedIn", () => {
    it("returns false when key is missing", () => {
      expect(isLoggedIn()).toBe(false);
    });

    it("returns true when key is present", () => {
      localStorage.setItem("isLoggedIn", "true");
      expect(isLoggedIn()).toBe(true);
    });
  });

  describe("logoutIfInactive", () => {
    it("removes key & reloads after 10 minutes of inactivity", () => {
      localStorage.setItem("isLoggedIn", "true");
      logoutIfInactive(); // sets timers & handlers

      // simulate initial onload trigger
      window.onload && window.onload(new Event("load"));

      // advance just before timeout
      vi.advanceTimersByTime(TEN_MIN - 1);
      expect(localStorage.getItem("isLoggedIn")).toBe("true");
      expect(reloadSpy).not.toHaveBeenCalled();

      // cross timeout
      vi.advanceTimersByTime(1);
      expect(localStorage.getItem("isLoggedIn")).toBeNull();
      expect(reloadSpy).toHaveBeenCalledTimes(1);
    });

    it("resets timer when user moves mouse / presses key", () => {
      localStorage.setItem("isLoggedIn", "true");
      logoutIfInactive();
      window.onload && window.onload(new Event("load"));

      // let 5 minutes pass
      vi.advanceTimersByTime(5 * 60 * 1000);

      // user activity -> reset
      document.onmousemove && document.onmousemove(new MouseEvent("mousemove"));

      // jump to almost 10 mins after reset
      vi.advanceTimersByTime(TEN_MIN - 1);
      expect(localStorage.getItem("isLoggedIn")).toBe("true");
      expect(reloadSpy).not.toHaveBeenCalled();

      // now expire
      vi.advanceTimersByTime(1);
      expect(localStorage.getItem("isLoggedIn")).toBeNull();
      expect(reloadSpy).toHaveBeenCalled();
    });
  });
});

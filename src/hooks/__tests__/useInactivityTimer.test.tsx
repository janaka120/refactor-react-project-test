import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import useInactivityTimer from "../UseInactivityTimer";

// We'll pass a tiny limit so tests run fast
const LIMIT = 1000; // 1s

describe("useInactivityTimer", () => {
  let dispatchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.setItem("isLoggedIn", "true");
    dispatchSpy = vi.spyOn(window, "dispatchEvent");
  });

  afterEach(() => {
    vi.useRealTimers();
    dispatchSpy.mockRestore();
    localStorage.clear();
  });

  it("logs out and dispatches event after inactivity limit", () => {
    renderHook(() => useInactivityTimer(LIMIT));

    // Nothing yet
    expect(localStorage.getItem("isLoggedIn")).toBe("true");

    // Advance to just before the limit
    act(() => {
      vi.advanceTimersByTime(LIMIT - 1);
    });
    expect(localStorage.getItem("isLoggedIn")).toBe("true");
    expect(dispatchSpy).not.toHaveBeenCalledWith(expect.any(Event));

    // Cross the limit
    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(localStorage.getItem("isLoggedIn")).toBeNull();
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: "login-success" })
    );
  });

  it("resets the timer on activity events", () => {
    renderHook(() => useInactivityTimer(LIMIT));

    // 500ms pass
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Simulate user activity -> should reset timer
    act(() => {
      window.dispatchEvent(new Event("mousemove"));
    });

    // Advance 900ms (less than LIMIT since reset)
    act(() => {
      vi.advanceTimersByTime(900);
    });
    // Still logged in
    expect(localStorage.getItem("isLoggedIn")).toBe("true");

    // Now cross full limit since last reset
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(localStorage.getItem("isLoggedIn")).toBeNull();
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: "login-success" })
    );
  });

  it("cleans up listeners and timer on unmount", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useInactivityTimer(LIMIT));

    // 4 events set
    expect(addSpy).toHaveBeenCalledTimes(4);

    unmount();

    // 4 events removed
    expect(removeSpy).toHaveBeenCalledTimes(4);

    // Reset spies
    addSpy.mockRestore();
    removeSpy.mockRestore();

    // Timer cleared — advancing should not logout anymore
    localStorage.setItem("isLoggedIn", "true");
    act(() => {
      vi.advanceTimersByTime(LIMIT + 10);
    });
    expect(localStorage.getItem("isLoggedIn")).toBe("true");
  });
});

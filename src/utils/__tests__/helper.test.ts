import { describe, it, expect, beforeEach } from "vitest";
import {
  GRID_ROWS,
  GRID_COLS,
  NAV_BAR_HEIGHT,
  INACTIVITY_LIMIT,
  THEME_KEY,
  getDefaultPanelPosition,
  getGridCellPosition,
  isLoggedIn,
} from "../helper";

describe("helper constants", () => {
  it("have expected values", () => {
    expect(GRID_ROWS).toBe(2);
    expect(GRID_COLS).toBe(2);
    expect(NAV_BAR_HEIGHT).toBe(56);
    expect(INACTIVITY_LIMIT).toBe(5 * 60 * 1000);
    expect(THEME_KEY).toBe("theme");
  });
});

describe("getDefaultPanelPosition", () => {
  it("returns offset based on count", () => {
    expect(getDefaultPanelPosition(0)).toEqual({
      x: 60,
      y: 60,
      width: 700,
      height: 420,
    });
    expect(getDefaultPanelPosition(3)).toEqual({
      x: 60 + 3 * 40,
      y: 60 + 3 * 40,
      width: 700,
      height: 420,
    });
  });
});

describe("getGridCellPosition", () => {
  it("computes correct cell rect", () => {
    // container 800x600, nav 56, 2x2 grid
    const pos00 = getGridCellPosition(0, 0, 800, 600, NAV_BAR_HEIGHT);
    expect(pos00).toEqual({
      x: 0,
      y: NAV_BAR_HEIGHT, // 56
      width: 400,
      height: 300,
    });

    const pos11 = getGridCellPosition(1, 1, 800, 600, NAV_BAR_HEIGHT);
    expect(pos11).toEqual({
      x: 400,
      y: NAV_BAR_HEIGHT + 300, // 56 + 300
      width: 400,
      height: 300,
    });
  });
});

describe("isLoggedIn", () => {
  beforeEach(() => localStorage.clear());

  it("returns false when key missing", () => {
    expect(isLoggedIn()).toBe(false);
  });

  it("returns true when key === 'true'", () => {
    localStorage.setItem("isLoggedIn", "true");
    expect(isLoggedIn()).toBe(true);
  });

  it("returns false when key !== 'true'", () => {
    localStorage.setItem("isLoggedIn", "false");
    expect(isLoggedIn()).toBe(false);
  });
});

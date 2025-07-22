export const GRID_ROWS = 2;
export const GRID_COLS = 2;
export const NAV_BAR_HEIGHT = 56; // must match your UI
export const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes
export const THEME_KEY = "theme";

export const getDefaultPanelPosition = (count: number) => ({
  x: 60 + count * 40,
  y: 60 + count * 40,
  width: 700,
  height: 420,
});

export const getGridCellPosition = (
  row: number,
  col: number,
  containerWidth: number,
  containerHeight: number,
  navBarHeight: number
) => {
  const cellWidth = containerWidth / GRID_COLS;
  const cellHeight = containerHeight / GRID_ROWS;
  return {
    x: Math.round(col * cellWidth),
    y: Math.round(row * cellHeight + navBarHeight),
    width: Math.round(cellWidth),
    height: Math.round(cellHeight),
  };
};

export const isLoggedIn = () => localStorage.getItem("isLoggedIn") === "true";

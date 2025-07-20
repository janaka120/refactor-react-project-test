import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { GridDropOverlay } from "../GridDropOverlay";

describe("GridDropOverlay", () => {
  test("renders correct number of grid cells", () => {
    render(
      <GridDropOverlay rows={2} cols={3} activeCell={null} visible={true} />
    );
    const gridCells = screen.getAllByTestId(/cell-\d+-\d+/);

    expect(gridCells.length).toBe(6);
  });

  it("sets opacity to 0 when not visible", () => {
    const { container } = render(
      <GridDropOverlay rows={1} cols={1} activeCell={null} visible={false} />
    );
    const grid = container.firstChild as HTMLDivElement;
    expect(grid).toHaveStyle("opacity: 0");
  });
});

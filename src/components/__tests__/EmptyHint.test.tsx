import { render, screen } from "@testing-library/react";
import EmptyHint from "../EmptyHint";
import React from "react";

describe("EmptyHint", () => {
  it("shows the no-panels message", () => {
    render(<EmptyHint />);

    expect(screen.getByText(/No panels open\./i)).toBeInTheDocument();
    expect(
      screen.getByText(/Drag one from the navigation bar\./i)
    ).toBeInTheDocument();
  });
});

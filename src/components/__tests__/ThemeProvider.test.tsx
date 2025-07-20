import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "../ThemeProvider";
import React from "react";

describe("Panel", () => {
  it("renders the theme light correctly", () => {
    render(
      <ThemeProvider mode={"light"}>
        <p>Theme light</p>
      </ThemeProvider>
    );

    expect(screen.getByText("Theme light")).toBeInTheDocument();
  });

  it("applies the theme dark correctly", () => {
    render(
      <ThemeProvider mode={"dark"}>
        <p>Theme dark</p>
      </ThemeProvider>
    );
    expect(screen.getByText("Theme dark")).toBeInTheDocument();
  });
});

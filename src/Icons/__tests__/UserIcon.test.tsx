import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserIcon from "../UserIcon";

describe("UserIcon", () => {
  it("renders the SVG element correctly", () => {
    const { container } = render(<UserIcon />);

    const svgElement = container.querySelector("svg");

    expect(svgElement).toBeInTheDocument();

    expect(svgElement).toHaveAttribute("width", "20");
    expect(svgElement).toHaveAttribute("height", "20");
    expect(svgElement).toHaveAttribute("viewBox", "0 0 20 20");

    const circleElement = container.querySelector("circle");
    expect(circleElement).toBeInTheDocument();
    expect(circleElement).toHaveAttribute("cx", "10");
    expect(circleElement).toHaveAttribute("r", "4");

    const pathElement = container.querySelector("path");
    expect(pathElement).toBeInTheDocument();
    expect(pathElement).toHaveAttribute("d", "M3 17c0-2.5 3-4 7-4s7 1.5 7 4");
  });

  it("applies custom styles passed via the style prop", () => {
    const customStyle = {
      backgroundColor: "red",
      border: "1px solid blue",
      opacity: "0.5",
    };

    const { container } = render(<UserIcon style={customStyle} />);

    const svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();

    expect(svgElement).toHaveStyle("background-color: rgb(255, 0, 0)");
    expect(svgElement).toHaveStyle("border: 1px solid blue");
    expect(svgElement).toHaveStyle("opacity: 0.5");
  });

  it("should have a default aria-hidden attribute if it is purely decorative", () => {
    const { container } = render(<UserIcon />);
    const svgElement = container.querySelector("svg");
    expect(svgElement).toHaveAttribute("aria-hidden", "true");
  });
});

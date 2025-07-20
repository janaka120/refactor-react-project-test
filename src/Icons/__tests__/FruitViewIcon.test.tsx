import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FruitViewIcon from "../FruitViewIcon"; // Adjust the import path as needed
import { describe, it, expect } from "vitest";

describe("FruitViewIcon", () => {
  it("renders without crashing and has the correct role", () => {
    render(<FruitViewIcon />);
    // Expect the SVG to be rendered and accessible with the 'img' role
    const svgElement = screen.getByRole("img");
    expect(svgElement).toBeInTheDocument();
  });

  it("renders with default size (22) when no size prop is provided", () => {
    render(<FruitViewIcon />);
    const svgElement = screen.getByRole("img");
    expect(svgElement).toHaveAttribute("width", "22");
    expect(svgElement).toHaveAttribute("height", "22");
    expect(svgElement).toHaveAttribute("viewBox", "0 0 22 22");
    expect(svgElement).toHaveAttribute("fill", "none"); // Check the default fill attribute
  });

  it("renders with custom size when size prop is provided", () => {
    const customSize = 40;
    render(<FruitViewIcon size={customSize} />);
    const svgElement = screen.getByRole("img");
    expect(svgElement).toHaveAttribute("width", customSize.toString());
    expect(svgElement).toHaveAttribute("height", customSize.toString());
    expect(svgElement).toHaveAttribute("viewBox", "0 0 22 22"); // ViewBox should remain constant
    expect(svgElement).toHaveAttribute("fill", "none");
  });

  it("contains the correct SVG elements and their attributes", () => {
    render(<FruitViewIcon />);
    const svgElement = screen.getByRole("img");

    // Check for the large outer circle (main fruit shape)
    const circle1 = svgElement.querySelector("circle:nth-of-type(1)");
    expect(circle1).toBeInTheDocument();
    expect(circle1).toHaveAttribute("cx", "11");
    expect(circle1).toHaveAttribute("cy", "11");
    expect(circle1).toHaveAttribute("r", "9");
    expect(circle1).toHaveAttribute("stroke", "#FFD600");
    expect(circle1).toHaveAttribute("stroke-width", "2");
    expect(circle1).toHaveAttribute("fill", "#FFF9C4");

    // Check for the inner ellipse
    const ellipse1 = svgElement.querySelector("ellipse:nth-of-type(1)");
    expect(ellipse1).toBeInTheDocument();
    expect(ellipse1).toHaveAttribute("cx", "11");
    expect(ellipse1).toHaveAttribute("cy", "11");
    expect(ellipse1).toHaveAttribute("rx", "5");
    expect(ellipse1).toHaveAttribute("ry", "7");
    expect(ellipse1).toHaveAttribute("fill", "#FFEB3B");
    expect(ellipse1).toHaveAttribute("stroke", "#FBC02D");
    expect(ellipse1).toHaveAttribute("stroke-width", "1.5");

    // Check for the small central circle (seed/core)
    const circle2 = svgElement.querySelector("circle:nth-of-type(2)"); // It's the second circle
    expect(circle2).toBeInTheDocument();
    expect(circle2).toHaveAttribute("cx", "11");
    expect(circle2).toHaveAttribute("cy", "11");
    expect(circle2).toHaveAttribute("r", "2");
    expect(circle2).toHaveAttribute("fill", "#F57C00");

    // Check for the first path (left leaf/stem part)
    const path1 = svgElement.querySelector("path:nth-of-type(1)");
    expect(path1).toBeInTheDocument();
    expect(path1).toHaveAttribute("d", "M11 4 L13 2");
    expect(path1).toHaveAttribute("stroke", "#388E3C");
    expect(path1).toHaveAttribute("stroke-width", "1.5");
    expect(path1).toHaveAttribute("stroke-linecap", "round");

    // Check for the second path (right leaf/stem part)
    const path2 = svgElement.querySelector("path:nth-of-type(2)");
    expect(path2).toBeInTheDocument();
    expect(path2).toHaveAttribute("d", "M11 4 L9 2");
    expect(path2).toHaveAttribute("stroke", "#388E3C");
    expect(path2).toHaveAttribute("stroke-width", "1.5");
    expect(path2).toHaveAttribute("stroke-linecap", "round");
  });
});

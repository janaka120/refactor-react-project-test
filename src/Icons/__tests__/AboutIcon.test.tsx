import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AboutIcon from "../AboutIcon";
import { describe, it, expect } from "vitest";

describe("AboutIcon", () => {
  it("renders without crashing", () => {
    render(<AboutIcon />);
    // Check if the SVG element is in the document
    const svgElement = screen.getByRole("img");
    expect(svgElement).toBeInTheDocument();
  });

  it("renders with default size (22) when no size prop is provided", () => {
    render(<AboutIcon />);
    const svgElement = screen.getByRole("img");
    expect(svgElement).toHaveAttribute("width", "22");
    expect(svgElement).toHaveAttribute("height", "22");
    expect(svgElement).toHaveAttribute("viewBox", "0 0 22 22");
  });

  it("renders with custom size when size prop is provided", () => {
    const customSize = 30;
    render(<AboutIcon size={customSize} />);
    const svgElement = screen.getByRole("img");
    expect(svgElement).toHaveAttribute("width", customSize.toString());
    expect(svgElement).toHaveAttribute("height", customSize.toString());
    expect(svgElement).toHaveAttribute("viewBox", "0 0 22 22");
  });

  it("contains the correct SVG elements and attributes", () => {
    render(<AboutIcon />);
    const svgElement = screen.getByRole("img");

    // Check for the main rectangle
    const rect1 = svgElement.querySelector("rect:nth-of-type(1)");
    expect(rect1).toBeInTheDocument();
    expect(rect1).toHaveAttribute("x", "3");
    expect(rect1).toHaveAttribute("y", "3");
    expect(rect1).toHaveAttribute("width", "16");
    expect(rect1).toHaveAttribute("height", "16");
    expect(rect1).toHaveAttribute("rx", "4");
    expect(rect1).toHaveAttribute("fill", "#7c5fe6");

    // Check for the first small rectangle (dot)
    const rect2 = svgElement.querySelector("rect:nth-of-type(2)");
    expect(rect2).toBeInTheDocument();
    expect(rect2).toHaveAttribute("x", "10");
    expect(rect2).toHaveAttribute("y", "7");
    expect(rect2).toHaveAttribute("width", "2");
    expect(rect2).toHaveAttribute("height", "2");
    expect(rect2).toHaveAttribute("rx", "1");
    expect(rect2).toHaveAttribute("fill", "#fff");

    // Check for the second small rectangle (bar)
    const rect3 = svgElement.querySelector("rect:nth-of-type(3)");
    expect(rect3).toBeInTheDocument();
    expect(rect3).toHaveAttribute("x", "10");
    expect(rect3).toHaveAttribute("y", "10");
    expect(rect3).toHaveAttribute("width", "2");
    expect(rect3).toHaveAttribute("height", "5");
    expect(rect3).toHaveAttribute("rx", "1");
    expect(rect3).toHaveAttribute("fill", "#fff");
  });
});

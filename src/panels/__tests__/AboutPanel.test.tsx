import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AboutPanel from "../AboutPanel";

describe("AboutPanel", () => {
  it("renders the AboutPanel component without crashing", () => {
    render(<AboutPanel />);
  });

  it('displays the main heading "About"', () => {
    render(<AboutPanel />);

    const heading = screen.getByRole("heading", { name: /About/i, level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it("displays all expected text content correctly structured", () => {
    render(<AboutPanel />);

    expect(screen.getByText(/Welcome to/i)).toBeInTheDocument();

    const fruteriaBold = screen.getByText("fruteria", { selector: "b" });
    expect(fruteriaBold).toBeInTheDocument();

    expect(fruteriaBold.nextSibling?.textContent).toBe("!");

    expect(
      screen.getByText(
        /This is a playful trading app for fruit, built with React./i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Drag panels from the sidebar to explore features./i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Made with 🍌 and ❤️/i)).toBeInTheDocument();
  });

  it("applies basic inline styles to the main container", () => {
    const { container } = render(<AboutPanel />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toBeInTheDocument();
    expect(mainDiv).toHaveStyle("padding: 24px");
    expect(mainDiv).toHaveStyle("color: rgb(224, 224, 224)");
    expect(mainDiv).toHaveStyle("font-family: monospace");
  });

  it("applies styles to the heading", () => {
    render(<AboutPanel />);
    const heading = screen.getByRole("heading", { name: /About/i, level: 2 });

    expect(heading).toHaveStyle("color: rgb(255, 255, 255)");
    expect(heading).toHaveStyle("font-weight: 700");
    expect(heading).toHaveStyle("font-size: 22px");
  });
});

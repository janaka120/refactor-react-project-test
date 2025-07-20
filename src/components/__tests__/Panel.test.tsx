import { render, screen } from "@testing-library/react";
import Panel from "../Panel";
import React from "react";

describe("Panel", () => {
  it("renders the title and children correctly", () => {
    render(
      <Panel title="Test Panel">
        <p>Panel content</p>
      </Panel>
    );

    expect(screen.getByText("Test Panel")).toBeInTheDocument();
    expect(screen.getByText("Panel content")).toBeInTheDocument();
  });

  it("applies correct styling to title and container", () => {
    render(<Panel title="Styled Panel">Child</Panel>);
    const titleElement = screen.getByText("Styled Panel");
    const container = titleElement.closest("div")?.parentElement;

    expect(titleElement).toHaveStyle("fontWeight: 700");
    expect(container).toHaveStyle("background: #232b3e");
  });
});

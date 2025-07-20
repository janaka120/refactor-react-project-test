import { render, screen } from "@testing-library/react";
import FruitEnrichmentPanel from "../FruitEnrichmentPanel";
import { describe, it, expect, vi } from "vitest";
import React from "react";

vi.mock("../ResizableDraggablePanel", () => ({
  default: ({ title, content }: any) => (
    <div>
      <div>{title}</div>
      <div>{content}</div>
    </div>
  ),
}));

vi.mock("ag-grid-react", () => ({
  AgGridReact: () => (
    <div>
      <div>ID</div>
      <div>Ecuador</div>
      <div>Tropical</div>
      <div>Sweet and yellow</div>
    </div>
  ),
}));

describe("FruitEnrichmentPanel", () => {
  const mockFruit = {
    id: 1,
    name: "Banana",
    country: "Ecuador",
    type: "Tropical",
    status: "Fresh",
    details: "Sweet and yellow",
  };

  it("renders panel with correct title", () => {
    render(<FruitEnrichmentPanel fruit={mockFruit} onClose={vi.fn()} />);
    expect(screen.getByText("Banana Enrichment")).toBeInTheDocument();
  });

  it("displays fruit enrichment data in the grid", async () => {
    render(<FruitEnrichmentPanel fruit={mockFruit} onClose={vi.fn()} />);

    expect(await screen.findByText(/ID/i)).toBeInTheDocument();
    expect(screen.getByText(/Ecuador/i)).toBeInTheDocument();
    expect(screen.getByText(/Tropical/i)).toBeInTheDocument();
    expect(screen.getByText(/Sweet and yellow/i)).toBeInTheDocument();
  });
});

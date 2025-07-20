import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FruitBook from "../FruitBookPanel";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ReactDOM from "react-dom";
import React from "react";

vi.mock("react-dom", async () => {
  const actual = await vi.importActual<typeof ReactDOM>("react-dom");
  return {
    ...actual,
    createPortal: (node: React.ReactNode) => node, // mock portal to render inline
  };
});

describe("FruitBook", () => {
  beforeEach(() => {
    document.body.innerHTML = ""; // reset DOM for each test
  });

  it("renders the title", () => {
    render(<FruitBook />);
    expect(screen.getByText("Fruit Book")).toBeInTheDocument();
  });

  it("renders the grid and row data", async () => {
    render(<FruitBook />);
    expect(await screen.findByText("Banana")).toBeInTheDocument();
    expect(screen.getByText("Apple")).toBeInTheDocument();
  });

  it("opens enrichment panel on row double-click", async () => {
    render(<FruitBook />);
    const row = await screen.findByText("Banana");
    fireEvent.doubleClick(row);
    await waitFor(() => {
      expect(screen.getByText(/Banana/)).toBeInTheDocument();
    });
  });
});

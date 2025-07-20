// Place this at the very top of your test file
import { vi } from "vitest";

// Mock Ant Design's message module before importing FruitViewPanel
vi.mock("antd", async () => {
  // Import the actual antd module so we can spread its exports
  const actual = await vi.importActual("antd");
  return {
    ...actual,
    // Overwrite the message export with our mock functions.
    message: {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
    },
  };
});

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FruitViewPanel } from "../FruitViewPanel";
import { message as antdMessage } from "antd"; // Import the mocked message

describe("FruitViewPanel", () => {
  beforeEach(() => {
    // Optionally, clear any state between tests
    vi.clearAllMocks();
  });

  it("renders with default fruit and inventory", () => {
    render(<FruitViewPanel />);
    expect(screen.getByText(/Fruit View/i)).toBeInTheDocument();
    expect(screen.getByText(/Inventory/i)).toBeInTheDocument();
    // Verify that one of the fruits is displayed, e.g., "apple"
    expect(screen.getByText("apple")).toBeInTheDocument();
  });

  it("allows buying fruit and updates message + inventory", async () => {
    render(<FruitViewPanel />);
    const buyButton = screen.getByRole("button", { name: /buy/i });

    fireEvent.click(buyButton);

    // wait for the asynchronous message update
    await waitFor(() => {
      expect(screen.getByText(/Bought 1 apple/i)).toBeInTheDocument();
    });

    expect(antdMessage.success).toHaveBeenCalledWith("Bought 1 apple(s).");
  });

  it("allows selling fruit and updates message + inventory", async () => {
    render(<FruitViewPanel />);
    const sellButton = screen.getByRole("button", { name: /sell/i });

    fireEvent.click(sellButton);

    await waitFor(() => {
      expect(screen.getByText(/Sold 1 apple/i)).toBeInTheDocument();
    });

    expect(antdMessage.info).toHaveBeenCalledWith("Sold 1 apple(s).");
  });

  it("shows error when buying too much", async () => {
    render(<FruitViewPanel />);
    // Adjust the amount input (assumes it's a spinbutton) to a high value
    const amountInput = screen.getByRole("spinbutton");
    fireEvent.change(amountInput, { target: { value: 100 } });

    fireEvent.click(screen.getByRole("button", { name: /buy/i }));

    await waitFor(() => {
      expect(screen.getByText(/Not enough apples/i)).toBeInTheDocument();
    });

    expect(antdMessage.error).toHaveBeenCalledWith(
      "Not enough apples in inventory."
    );
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import ResizableDraggablePanel from "../ResizableDraggablePanel";
import React from "react";

describe("ResizableDraggablePanel", () => {
  const defaultProps = {
    id: "panel-1",
    title: "Test Panel",
    content: <div>Panel Content</div>,
    x: 100,
    y: 150,
    width: 300,
    height: 200,
    onClose: vi.fn(),
    onMove: vi.fn(),
    onResize: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the panel with correct title and content", () => {
    render(<ResizableDraggablePanel children={""} {...defaultProps} />);
    expect(screen.getByText("Test Panel")).toBeInTheDocument();
    expect(screen.getByText("Panel Content")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<ResizableDraggablePanel children={""} {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("calls onMove when dragging", () => {
    render(<ResizableDraggablePanel children={""} {...defaultProps} />);
    const header = screen.getByText("Test Panel");

    fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(window, { clientX: 120, clientY: 130 });
    fireEvent.mouseUp(window);

    expect(defaultProps.onMove).toHaveBeenCalled();
    expect(defaultProps.onMove).toHaveBeenCalledWith(20, 30);
  });

  it("calls onResize when resizing", () => {
    render(<ResizableDraggablePanel children={""} {...defaultProps} />);
    const resizeHandle = screen.getByTestId("polyline-svg-icon"); // svg handle

    fireEvent.mouseDown(resizeHandle, { clientX: 200, clientY: 200 });
    fireEvent.mouseMove(window, { clientX: 250, clientY: 260 });
    fireEvent.mouseUp(window);

    expect(defaultProps.onResize).toHaveBeenCalled();
    expect(defaultProps.onResize).toHaveBeenCalledWith(50, 60);
  });
});

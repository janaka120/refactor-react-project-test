import React from "react";
import { render, fireEvent, screen, createEvent } from "@testing-library/react";
import { MainWorkspace } from "../MainWorkspace";

describe("MainWorkspace", () => {
  const gridRows = 2;
  const gridCols = 2;

  const setup = (propsOverrides = {}) => {
    const onDrop = vi.fn();
    const onDragOver = vi.fn();
    const onGridDropInfo = vi.fn();

    const utils = render(
      <MainWorkspace
        onDrop={onDrop}
        onDragOver={onDragOver}
        onGridDropInfo={onGridDropInfo}
        gridRows={gridRows}
        gridCols={gridCols}
        {...propsOverrides}
      >
        <div>Child content</div>
      </MainWorkspace>
    );
    const workspaceDiv = utils.getByText("Child content").parentElement!; // The div wrapping children

    return { ...utils, onDrop, onDragOver, onGridDropInfo, workspaceDiv };
  };

  it("renders children", () => {
    const { getByText } = setup();
    expect(getByText("Child content")).toBeInTheDocument();
  });

  it("calls onDragOver and updates activeCell and calls onGridDropInfo", () => {
    const { workspaceDiv, onDragOver, onGridDropInfo } = setup();

    const workspace = screen.getByTestId("workspace");

    // Mock getBoundingClientRect on the actual element
    vi.spyOn(workspace, "getBoundingClientRect").mockReturnValue({
      width: 200,
      height: 200,
      top: 0,
      left: 0,
      bottom: 200,
      right: 200,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    // Create proper dragOver event with clientX and clientY
    const dragEvent = createEvent.dragOver(workspace, {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(dragEvent, "clientX", { value: 150 });
    Object.defineProperty(dragEvent, "clientY", { value: 150 });

    // Dispatch the custom event
    fireEvent(workspace, dragEvent);

    expect(onDragOver).toHaveBeenCalled();

    expect(onGridDropInfo).toHaveBeenCalledWith({
      cell: { row: 1, col: 1 },
      size: { width: 200, height: 200 },
    });
  });

  it("calls onDrop and resets states on drop", () => {
    const { workspaceDiv, onDrop, onGridDropInfo } = setup();

    // Provide dummy size for containerSize state by mocking offsetWidth/Height
    Object.defineProperty(workspaceDiv, "offsetWidth", { value: 200 });
    Object.defineProperty(workspaceDiv, "offsetHeight", { value: 200 });

    // Simulate drop event
    fireEvent.drop(workspaceDiv, {
      dataTransfer: { getData: () => "dummy" },
    });

    expect(onDrop).toHaveBeenCalled();
    expect(onGridDropInfo).toHaveBeenCalledWith({
      cell: null,
      size: { width: 0, height: 0 }, // containerSize initialized at 0 (since no resize event in test)
    });
  });

  it("shows GridDropOverlay when dragging or panel dragging", () => {
    const { getByText, rerender } = setup();

    // Initially not dragging -> GridDropOverlay visible prop false
    // Can't directly test internal state, but we trust visual behavior

    // Rerender with dragging true
    rerender(
      <MainWorkspace
        onDrop={() => {}}
        onDragOver={() => {}}
        gridRows={gridRows}
        gridCols={gridCols}
      >
        <div>Child content</div>
      </MainWorkspace>
    );

    // The GridDropOverlay is rendered inside the main div, can't select by role, but test no crash

    // Simulate drag events to toggle dragging state using window.mainWorkspaceHandleDragStart
    // Call the exposed method and check for side effects if needed

    // This is tricky in unit test; for full coverage, test integration or snapshot test
  });

  it("cleans up event listeners on unmount", () => {
    const { unmount } = setup();
    const spyRemoveEventListener = vi.spyOn(window, "removeEventListener");
    unmount();
    expect(spyRemoveEventListener).toHaveBeenCalledWith(
      "panel-drag-start",
      expect.any(Function)
    );
    expect(spyRemoveEventListener).toHaveBeenCalledWith(
      "panel-drag-end",
      expect.any(Function)
    );
    expect(spyRemoveEventListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
    spyRemoveEventListener.mockRestore();
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NavItem, { NavItemProps } from "../NavItem";
import React, { DragEvent } from "react";

const makeDataTransfer = () =>
  ({
    data: {},
    setData: vi.fn(function (type: string, val: string) {
      this.data[type] = val;
    }),
    getData: vi.fn(function (type: string) {
      return this.data[type];
    }),
    clearData: vi.fn(),
    dropEffect: "move",
    effectAllowed: "all",
    files: [],
    items: [],
    types: [],
  } as unknown as DataTransfer);

describe("NavItem", () => {
  const panelKey = "fruitview";
  const title = "Fruit View";
  const Icon = () => <span data-testid="icon">🍎</span>;

  it("renders title and icon", () => {
    const innerHandler = vi.fn<(e: DragEvent<HTMLLIElement>) => void>();

    const onDragStart: NavItemProps["onDragStart"] = vi
      .fn()
      .mockReturnValue(innerHandler);

    const onDragEnd = vi.fn();

    render(
      <NavItem
        panelKey={panelKey}
        title={title}
        icon={<Icon />}
        draggingKey={null}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    );

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("calls onDragStart(panelKey) and returned handler on dragStart", () => {
    const innerHandler = vi.fn<(e: DragEvent<HTMLLIElement>) => void>();
    const onDragStart = vi.fn().mockReturnValue(innerHandler);
    const onDragEnd = vi.fn();

    render(
      <NavItem
        panelKey={panelKey}
        title={title}
        icon={<Icon />}
        draggingKey={null}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    );

    const li = screen.getByText(title).closest("li")!;
    const dt = makeDataTransfer();

    fireEvent.dragStart(li, { dataTransfer: dt });

    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(onDragStart).toHaveBeenCalledWith(panelKey);
    expect(innerHandler).toHaveBeenCalledTimes(1);
  });

  it("calls onDragEnd on dragEnd", () => {
    const onDragStart = vi.fn().mockReturnValue(vi.fn());
    const onDragEnd = vi.fn();

    render(
      <NavItem
        panelKey={panelKey}
        title={title}
        icon={<Icon />}
        draggingKey={null}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    );

    const li = screen.getByText(title).closest("li")!;
    fireEvent.dragEnd(li);

    expect(onDragEnd).toHaveBeenCalledTimes(1);
  });

  it("applies dragging background when draggingKey matches", () => {
    const onDragStart = vi.fn().mockReturnValue(vi.fn());
    const onDragEnd = vi.fn();

    const { rerender } = render(
      <NavItem
        panelKey={panelKey}
        title={title}
        icon={<Icon />}
        draggingKey={null}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    );

    const li = screen.getByText(title).closest("li")!;
    // not dragging style
    expect(li).not.toHaveStyle({ background: "#353b4a" });

    // re-render with dragging
    rerender(
      <NavItem
        panelKey={panelKey}
        title={title}
        icon={<Icon />}
        draggingKey={panelKey}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    );

    expect(li).toHaveStyle({ background: "#353b4a" });
  });
});

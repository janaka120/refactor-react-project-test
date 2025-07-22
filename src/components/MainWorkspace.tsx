import React, { useState, useRef, useEffect, ReactNode } from "react";
import { GridDropOverlay } from "./GridDropOverlay";

interface MainWorkspaceProps {
  children: ReactNode;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onGridDropInfo?: (info: {
    cell: { row: number; col: number } | null;
    size: { width: number; height: number };
  }) => void;
  gridRows?: number;
  gridCols?: number;
}

export const MainWorkspace: React.FC<MainWorkspaceProps> = ({
  children,
  onDrop,
  onDragOver,
  onGridDropInfo,
  gridRows = 2,
  gridCols = 2,
}) => {
  const [dragging, setDragging] = useState(false);
  const [isPanelDragging, setIsPanelDragging] = useState(false);
  const [activeCell, setActiveCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const dragDepth = useRef(0); // stabilize dragenter/leave

  // size cache
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const updateSize = () => {
      if (workspaceRef.current) {
        setContainerSize({
          width: workspaceRef.current.offsetWidth,
          height: workspaceRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // external nav drag
  useEffect(() => {
    const node = workspaceRef.current;
    if (!node) return;

    const onEnter = () => {
      dragDepth.current += 1;
      setDragging(true);
    };
    const onLeave = () => {
      dragDepth.current -= 1;
      if (dragDepth.current <= 0) {
        dragDepth.current = 0;
        setDragging(false);
        setActiveCell(null);
        onGridDropInfo?.({ cell: null, size: containerSize });
      }
    };

    node.addEventListener("dragenter", onEnter);
    node.addEventListener("dragleave", onLeave);
    return () => {
      node.removeEventListener("dragenter", onEnter);
      node.removeEventListener("dragleave", onLeave);
    };
  }, [containerSize, onGridDropInfo]);

  // listen for custom events from panels
  useEffect(() => {
    const handlePanelDragStart = () => setIsPanelDragging(true);
    const handlePanelDragEnd = () => {
      setIsPanelDragging(false);
      setActiveCell(null);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDragging(false);
        setIsPanelDragging(false);
        setActiveCell(null);
        dragDepth.current = 0;
      }
    };

    window.addEventListener("panel-drag-start", handlePanelDragStart as any);
    window.addEventListener("panel-drag-end", handlePanelDragEnd as any);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "panel-drag-start",
        handlePanelDragStart as any
      );
      window.removeEventListener("panel-drag-end", handlePanelDragEnd as any);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleDragOverInternal = (e: React.DragEvent) => {
    if (!workspaceRef.current) return;
    const rect = workspaceRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cellWidth = rect.width / gridCols;
    const cellHeight = rect.height / gridRows;

    const col = Math.max(0, Math.min(gridCols - 1, Math.floor(x / cellWidth)));
    const row = Math.max(0, Math.min(gridRows - 1, Math.floor(y / cellHeight)));
    const cell = { row, col };

    setActiveCell(cell);
    onGridDropInfo?.({
      cell,
      size: { width: rect.width, height: rect.height },
    });
  };

  // expose hook for parent
  (window as any).mainWorkspaceHandleDragStart = () => setDragging(true);

  return (
    <div
      ref={workspaceRef}
      data-testid="workspace"
      style={{ position: "relative", width: "100%", height: "100%" }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        setIsPanelDragging(false);
        setActiveCell(null);
        dragDepth.current = 0;
        onGridDropInfo?.({ cell: null, size: containerSize });
        onDrop(e);
      }}
      onDragOver={(e) => {
        e.preventDefault(); // ensure drop fires
        handleDragOverInternal(e);
        onDragOver(e);
      }}
    >
      {children}

      {/* Make sure overlay can't swallow pointer/mouse */}
      <div style={{ pointerEvents: "none" }}>
        <GridDropOverlay
          rows={gridRows}
          cols={gridCols}
          activeCell={activeCell}
          visible={dragging || isPanelDragging}
        />
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from "react";
import { GridDropOverlay } from "./GridDropOverlay";

interface MainWorkspaceProps {
  children: React.ReactNode;
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
  const [activeCell, setActiveCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [isPanelDragging, setIsPanelDragging] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);

  // Update container size on mount and resize
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

  // Only show overlay when dragging from nav (not when dragging panels inside)
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      // Only set dragging if dragging from outside (nav)
      setDragging(true);
    };
    const handleDragLeave = (e: DragEvent) => {
      setDragging(false);
      setActiveCell(null);
      if (onGridDropInfo) onGridDropInfo({ cell: null, size: containerSize });
    };
    const node = workspaceRef.current;
    if (node) {
      node.addEventListener("dragenter", handleDragEnter as any);
      node.addEventListener("dragleave", handleDragLeave as any);
    }
    return () => {
      if (node) {
        node.removeEventListener("dragenter", handleDragEnter as any);
        node.removeEventListener("dragleave", handleDragLeave as any);
      }
    };
    // eslint-disable-next-line
  }, [containerSize, onGridDropInfo]);
  // Listen for panel drag events (custom event)
  useEffect(() => {
    const handlePanelDragStart = () => setIsPanelDragging(true);
    const handlePanelDragEnd = () => {
      setIsPanelDragging(false);
      setActiveCell(null);
    };
    window.addEventListener("panel-drag-start", handlePanelDragStart as any);
    window.addEventListener("panel-drag-end", handlePanelDragEnd as any);
    // Listen for ESC key to cancel drag
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDragging(false);
        setIsPanelDragging(false);
        setActiveCell(null);
      }
    };
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

  const handleDragOver = (e: React.DragEvent) => {
    if (!workspaceRef.current) return;
    const rect = workspaceRef.current.getBoundingClientRect();
    console.log("workspaceRef.current.getBoundingClientRect() >>>", rect);
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cellWidth = rect.width / gridCols;
    const cellHeight = rect.height / gridRows;
    const col = Math.max(0, Math.min(gridCols - 1, Math.floor(x / cellWidth)));
    const row = Math.max(0, Math.min(gridRows - 1, Math.floor(y / cellHeight)));
    const cell = { row, col };
    setActiveCell(cell);
    if (onGridDropInfo)
      onGridDropInfo({
        cell,
        size: { width: rect.width, height: rect.height },
      });
  };

  // Expose handleDragStart for parent usage if needed
  (window as any).mainWorkspaceHandleDragStart = () => setDragging(true);

  return (
    <div
      ref={workspaceRef}
      data-testid="workspace"
      style={{ position: "relative", width: "100%", height: "100%" }}
      onDrop={(e) => {
        setDragging(false);
        setIsPanelDragging(false);
        setActiveCell(null);
        if (onGridDropInfo) onGridDropInfo({ cell: null, size: containerSize });
        onDrop(e);
      }}
      onDragOver={(e) => {
        handleDragOver(e);
        onDragOver(e);
      }}
      // Remove onDragLeave here, handled by effect above
    >
      {children}
      <GridDropOverlay
        rows={gridRows}
        cols={gridCols}
        activeCell={activeCell}
        visible={dragging || isPanelDragging}
      />
    </div>
  );
};

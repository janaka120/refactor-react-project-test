import React, { useState, useRef, useEffect } from "react";
import "./ResizableDraggablePanel.css"; // Optional styling import
import { getNextZIndex } from "../utils/zIndexManager";

interface Props {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  onMove: (dx: number, dy: number) => void;
  onResize: (dw: number, dh: number) => void;
  onClose: () => void;
  children: React.ReactNode;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  isDragging?: boolean; // External control for z-index layering
  zIndex?: number;
}

const ResizableDraggablePanel: React.FC<Props> = ({
  id,
  title,
  x,
  y,
  width,
  height,
  minWidth = 200,
  minHeight = 100,
  onMove,
  onResize,
  onClose,
  children,
  onDragStart,
  onDragEnd,
  isDragging = false,
  zIndex,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [currentZIndex, setCurrentZIndex] = useState(zIndex ?? getNextZIndex());

  const bringToFront = () => {
    setCurrentZIndex(getNextZIndex());
  };

  const handleDragStart = () => {
    bringToFront();
  };
  // Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDragStart();
    setDragging(true);
    setStart({ x: e.clientX, y: e.clientY });
    onDragStart?.();
  };

  // Resizing
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResizing(true);
    setStart({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        onMove(e.clientX - start.x, e.clientY - start.y);
        setStart({ x: e.clientX, y: e.clientY });
      } else if (resizing) {
        onResize(e.clientX - start.x, e.clientY - start.y);
        setStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      if (dragging) {
        setDragging(false);
        onDragEnd?.();
      }
      if (resizing) setResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, resizing, start, onMove, onResize, onDragEnd]);

  return (
    <div
      ref={panelRef}
      id={id}
      className={`panel ${isDragging ? "z-top" : ""}`}
      style={{
        position: "absolute",
        top: y,
        left: x,
        width,
        height,
        minWidth,
        minHeight,
        background: "var(--background-color)",
        boxShadow: "0 2px 8px #0006",
        overflow: "hidden",
        border: "1px solid #3e4a6b",
        borderRadius: 8,
        userSelect: "none",
        zIndex: currentZIndex,
        display: "flex",
        flexDirection: "column",
      }}
      onMouseDown={bringToFront}
    >
      <div
        className="panel-header"
        onMouseDown={handleMouseDown}
        style={{
          cursor: "move",
          padding: "8px 12px",
          background: "#2b3556",
          color: "white",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          display: "flex",
          fontWeight: 700,
          fontFamily: "monospace",
          fontSize: 16,
          alignItems: "center",
          justifyContent: "space-between",
          userSelect: "none",
        }}
      >
        <span>{title}</span>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: 18,
            cursor: "pointer",
            marginLeft: 8,
          }}
        >
          ✕
        </button>
      </div>

      <div
        className="panel-body"
        style={{
          background: "var(--background-color)",
          padding: 12,
          height: `calc(100% - 40px)`,
          overflow: "auto",
        }}
      >
        {children}
      </div>

      <div
        className="resize-handle"
        onMouseDown={handleResizeMouseDown}
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 12,
          height: 12,
          cursor: "nwse-resize",
          background: "transparent",
        }}
      />
    </div>
  );
};

export default ResizableDraggablePanel;

import React, { useRef } from "react";

type Props = {
  id: string;
  title: string;
  content: React.ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  onClose: () => void;
  onMove: (dx: number, dy: number) => void;
  onResize: (dw: number, dh: number) => void;
};

const ResizableDraggablePanel: React.FC<Props> = ({
  id,
  title,
  content,
  x,
  y,
  width,
  height,
  minWidth,
  minHeight,
  onClose,
  onMove,
  onResize,
}) => {
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const resizeStart = useRef<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // Drag logic
  const handleMouseDown = (e: React.MouseEvent) => {
    dragStart.current = { x: e.clientX, y: e.clientY };
    window.dispatchEvent(new Event("panel-drag-start")); // Show grid overlay
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (dragStart.current) {
        const dx = moveEvent.clientX - dragStart.current.x;
        const dy = moveEvent.clientY - dragStart.current.y;
        onMove(dx, dy);
        dragStart.current = { x: moveEvent.clientX, y: moveEvent.clientY };
      }
    };
    const handleMouseUp = () => {
      dragStart.current = null;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.dispatchEvent(new Event("panel-drag-end")); // Hide grid overlay
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Resize logic
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    resizeStart.current = { x: e.clientX, y: e.clientY, width, height };
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (resizeStart.current) {
        const dw = moveEvent.clientX - resizeStart.current.x;
        const dh = moveEvent.clientY - resizeStart.current.y;
        onResize(dw, dh);
      }
    };
    const handleMouseUp = () => {
      resizeStart.current = null;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        minWidth,
        minHeight,
        background: "#232b3e",
        borderRadius: 8,
        boxShadow: "0 2px 8px #0006",
        overflow: "hidden",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        border: "1px solid #3e4a6b",
      }}
    >
      <div
        style={{
          cursor: "move",
          background: "#2b3556",
          color: "#fff",
          padding: "8px 16px",
          fontWeight: 700,
          fontFamily: "monospace",
          fontSize: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          userSelect: "none",
        }}
        onMouseDown={handleMouseDown}
      >
        <span>{title}</span>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: 18,
            cursor: "pointer",
            marginLeft: 8,
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <div style={{ flex: 1, overflow: "auto", background: "#232b3e" }}>
        {content}
      </div>
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 18,
          height: 18,
          cursor: "nwse-resize",
          background: "transparent",
          zIndex: 10,
        }}
        onMouseDown={handleResizeMouseDown}
      >
        <svg width="18" height="18" data-testid="polyline-svg-icon">
          <polyline
            points="3,15 15,15 15,3"
            fill="none"
            stroke="#7c5fe6"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
};

export default ResizableDraggablePanel;

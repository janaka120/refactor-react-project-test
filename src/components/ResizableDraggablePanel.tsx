import React, { useState, useRef, useEffect } from "react";
import "./ResizableDraggablePanel.css";

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
  isDragging?: boolean;
  zIndex?: number;
}

const ResizableDraggablePanel: React.FC<Props> = (props) => {
  const {
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
  } = props;

  const panelRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  const fire = (name: "panel-drag-start" | "panel-drag-end") =>
    window.dispatchEvent(new CustomEvent(name, { detail: { id } }));

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDragging(true);
    setStart({ x: e.clientX, y: e.clientY });
    onDragStart?.();
    fire("panel-drag-start");
  };

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
        fire("panel-drag-end");
      }
      if (resizing) {
        setResizing(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
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
        border: "1px solid var(--border-color)",
        borderRadius: 8,
        userSelect: "none",
        zIndex: zIndex ?? 1000,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="panel-header"
        data-panel-handle
        onMouseDown={handleMouseDown}
        style={{
          cursor: "move",
          padding: "8px 12px",
          background: "var(--gradient-start)",
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
          aria-label="Close"
          title="Close"
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
        data-testid="resize-handle"
        style={{
          position: "absolute",
          right: 4,
          bottom: 4,
          width: 16,
          height: 16,
          cursor: "nwse-resize",
          overflow: "visible",
          zIndex: 2,
        }}
      >
        <svg
          viewBox="0 0 12 12"
          width="12"
          height="12"
          data-testid="polyline-svg-icon"
        >
          <polyline
            points="1,11 11,11 11,1"
            fill="none"
            stroke="#7c5fe6"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default ResizableDraggablePanel;

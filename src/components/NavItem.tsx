import React, { DragEvent } from "react";

export interface NavItemProps {
  panelKey: string;
  title: string;
  icon: React.ReactNode;
  draggingKey: string | null;
  onDragStart: (key: string) => (e: DragEvent<HTMLLIElement>) => void;
  onDragEnd: () => void;
}

const navItemStyle = (isDragging: boolean): React.CSSProperties => ({
  marginBottom: 16,
  cursor: "grab",
  background: isDragging ? "#353b4a" : undefined,
  padding: 8,
  borderRadius: 10,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 13,
  color: "var(--text-color)",
  width: "100%",
  transition: "background 0.2s",
  textAlign: "center",
  minHeight: 64,
});

const navItemTextStyle: React.CSSProperties = {
  width: "100%",
  textAlign: "center",
  fontSize: 13,
  fontWeight: 500,
  lineHeight: 1.2,
  wordBreak: "break-word",
};

const NavItem = React.memo<NavItemProps>(
  ({ panelKey, title, icon, draggingKey, onDragStart, onDragEnd }) => (
    <li
      draggable
      onDragStart={onDragStart(panelKey)}
      onDragEnd={onDragEnd}
      title={title}
      style={navItemStyle(draggingKey === panelKey)}
    >
      <span style={{ marginBottom: 4 }}>{icon}</span>
      <span style={navItemTextStyle}>{title}</span>
    </li>
  )
);

export default NavItem;

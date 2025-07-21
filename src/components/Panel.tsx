import React from "react";

export type PanelProps = {
  title: string;
  children: React.ReactNode;
};

const Panel: React.FC<PanelProps> = ({ title, children }) => (
  <div
    style={{
      background: "var(--panel-background-color)",
      borderRadius: 8,
      boxShadow: "0 2px 8px var(--panel-shadow-color)",
      padding: 24,
      margin: 16,
      color: "var(--text-color)",
      fontFamily: "monospace",
      minWidth: 320,
    }}
  >
    <div
      style={{
        fontWeight: 700,
        fontSize: 20,
        marginBottom: 16,
        letterSpacing: 1,
        color: "var(--text-color)",
      }}
    >
      {title}
    </div>
    <div>{children}</div>
  </div>
);

export default Panel;

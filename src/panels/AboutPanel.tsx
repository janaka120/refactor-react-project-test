import React from "react";

/**
 * AboutPanel displays information about the application.
 */
const AboutPanel: React.FC = () => (
  <div
    style={{ padding: 24, color: "var(--text-color)", fontFamily: "monospace" }}
  >
    <h2
      style={{
        color: "var(--text-color)",
        fontWeight: 700,
        fontSize: 22,
        margin: 0,
      }}
    >
      About
    </h2>
    <div style={{ marginTop: 12 }}>
      <p>
        Welcome to <b>fruteria</b>!<br />
        This is a playful trading app for fruit, built with React.
        <br />
        Drag panels from the sidebar to explore features.
        <br />
        <br />
        <i>Made with 🍌 and ❤️</i>
      </p>
    </div>
  </div>
);

export default AboutPanel;

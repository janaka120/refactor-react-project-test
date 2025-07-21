import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import Root from "./App"; // this is your new, refactored App.tsx
import "../styles/theme.less";

const theme = localStorage.getItem("theme") || "dark";
document.documentElement.className = `theme-${theme}`;

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <Root />
  </StrictMode>
);

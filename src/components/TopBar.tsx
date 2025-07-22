import React, { FC } from "react";
import { NAV_BAR_HEIGHT } from "../utils/helper";
import UserProfile from "./UserProfile";

interface TopBarProps {
  navOpen: boolean;
  toggleNav: () => void;
  theme: "dark" | "light";
  onThemeToggle: () => void;
}

const hamburgerBtnStyle = (navOpen: boolean): React.CSSProperties => ({
  background: "transparent",
  border: "none",
  color: "#fff",
  fontSize: 26,
  cursor: "pointer",
  marginRight: 20,
  display: "flex",
  alignItems: "center",
  padding: 0,
  height: 40,
  width: 40,
  borderRadius: 8,
  transition: "background 0.2s",
  boxShadow: navOpen ? "0 2px 8px #0002" : undefined,
  justifyContent: "center",
});

const appTitleStyle: React.CSSProperties = {
  fontFamily: "monospace",
  fontWeight: 700,
  fontSize: 22,
  letterSpacing: 2,
  color: "#fff",
  textShadow: "0 1px 2px #0006",
  userSelect: "none",
  textTransform: "uppercase",
};

const TopBar: FC<TopBarProps> = ({
  navOpen,
  toggleNav,
  theme,
  onThemeToggle,
}) => (
  <div
    style={{
      width: "100%",
      background:
        "linear-gradient(90deg, var(--gradient-start) 0%, var(--border-color) 100%)",
      color: "#fff",
      padding: "0rem 1.5rem",
      fontWeight: 600,
      fontSize: 20,
      letterSpacing: 1,
      position: "sticky",
      top: 0,
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      boxShadow: "0 2px 8px #0002",
      minHeight: NAV_BAR_HEIGHT,
      borderBottom: "1px solid var(--border-color)",
    }}
  >
    <button
      onClick={toggleNav}
      style={hamburgerBtnStyle(navOpen)}
      aria-label="Toggle navigation"
    >
      <span style={{ display: "inline-block", width: 28, height: 28 }}>
        {navOpen ? (
          <svg width="28" height="28" viewBox="0 0 28 28">
            <line
              x1="7"
              y1="7"
              x2="21"
              y2="21"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="21"
              y1="7"
              x2="7"
              y2="21"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 28 28">
            <rect y="6" width="28" height="3" rx="1.5" fill="#fff" />
            <rect y="13" width="28" height="3" rx="1.5" fill="#fff" />
            <rect y="20" width="28" height="3" rx="1.5" fill="#fff" />
          </svg>
        )}
      </span>
    </button>
    <span style={appTitleStyle}>fruteria</span>
    <div style={{ flex: 1 }} />
    <div style={{ marginRight: 32 }}>
      <UserProfile
        onLogout={() => {
          localStorage.removeItem("isLoggedIn");
          window.dispatchEvent(new Event("login-success"));
        }}
        onThemeToggle={onThemeToggle}
        theme={theme}
      />
    </div>
  </div>
);

export default TopBar;

import React, {
  FC,
  DragEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ResizableDraggablePanel from "./components/ResizableDraggablePanel";
import TermsIcon from "./Icons/TermsIcon";
import AboutIcon from "./Icons/AboutIcon";
import FruitViewIcon from "./Icons/FruitViewIcon";
import { MainWorkspace } from "./components/MainWorkspace";
import LoginComponent from "./components/LoginComponent";
import UserProfile from "./components/UserProfile";
import { panelList } from "./panelList";
import { logoutIfInactive } from "./utils/authUtils";
import { ThemeProvider } from "./components/ThemeProvider";

/**********************
 * Types & Constants   *
 **********************/
export type OpenPanel = {
  id: string;
  key: string;
  title: string;
  content: React.ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
};

const GRID_ROWS = 2;
const GRID_COLS = 2;
const NAV_BAR_HEIGHT = 56; // must match your UI
const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes
const THEME_KEY = "theme";

const getDefaultPanelPosition = (count: number) => ({
  x: 60 + count * 40,
  y: 60 + count * 40,
  width: 700,
  height: 420,
});

// NOTE: keep EXACT math from the working version
const getGridCellPosition = (
  row: number,
  col: number,
  containerWidth: number,
  containerHeight: number,
  navBarHeight: number
) => {
  const cellWidth = containerWidth / GRID_COLS;
  const cellHeight = containerHeight / GRID_ROWS;
  return {
    x: Math.round(col * cellWidth),
    y: Math.round(row * cellHeight + navBarHeight),
    width: Math.round(cellWidth),
    height: Math.round(cellHeight),
  };
};

const isLoggedIn = () => localStorage.getItem("isLoggedIn") === "true";

/**********************
 * Small hooks         *
 **********************/
function useTheme() {
  const lazyInit = () => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") return stored;
    const ask = window.confirm(
      "Use dark theme? Click OK for dark, Cancel for light."
    );
    const t = ask ? "dark" : "light";
    localStorage.setItem(THEME_KEY, t);
    return t;
  };
  const [theme, setTheme] = useState<"dark" | "light">(lazyInit);

  useEffect(() => {
    document.body.classList.remove("theme-dark", "theme-light");
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}

function useInactivityTimer(limit = INACTIVITY_LIMIT) {
  useEffect(() => {
    let timer: number | undefined;
    const reset = () => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        localStorage.removeItem("isLoggedIn");
        window.dispatchEvent(new Event("login-success"));
      }, limit);
    };
    const events = ["mousemove", "keydown", "mousedown", "touchstart"] as const;
    events.forEach((ev) => window.addEventListener(ev, reset));
    reset();
    return () => {
      if (timer) window.clearTimeout(timer);
      events.forEach((ev) => window.removeEventListener(ev, reset));
    };
  }, [limit]);
}

/**********************
 * Memoized NavItem    *
 **********************/
interface NavItemProps {
  panelKey: string;
  title: string;
  icon: React.ReactNode;
  draggingKey: string | null;
  onDragStart: (key: string) => (e: DragEvent<HTMLLIElement>) => void;
  onDragEnd: () => void;
}

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

/**********************
 * Styles              *
 **********************/
const navStyle: React.CSSProperties = {
  width: 90,
  background: "var(--background-color)",
  padding: "0.5rem 0.25rem",
  borderRight: "1px solid var(--border-color)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minWidth: 90,
  boxSizing: "border-box",
};

const navListStyle: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

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

/**********************
 * App Component       *
 **********************/
export const App: FC = () => {
  const { theme, toggleTheme } = useTheme();
  useInactivityTimer();

  const [openPanels, setOpenPanels] = useState<OpenPanel[]>([]);
  const [dragNavPanelKey, setDragNavPanelKey] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [dropCell, setDropCell] = useState<{ row: number; col: number } | null>(
    null
  );
  const [activePanelId, setActivePanelId] = useState<string | null>(null);

  // ---- drag from nav ----
  const onNavDragStart = useCallback(
    (key: string) => (e: DragEvent<HTMLLIElement>) => {
      setDragNavPanelKey(key);
      e.dataTransfer.setData("panelKey", key);
    },
    []
  );

  // ---- information from MainWorkspace (no perf issue: updates only when needed) ----
  const handleGridDropInfo = useCallback(
    (info: {
      cell: { row: number; col: number } | null;
      size: { width: number; height: number };
    }) => {
      setDropCell(info.cell);
      setContainerSize(info.size);
    },
    []
  );

  // ---- drop on workspace ----
  const onMainDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const key = e.dataTransfer.getData("panelKey");
      if (!key) return;
      const panelDef = panelList.find((p) => p.key === key);
      if (!panelDef) return;
      const id = `${key}-${Date.now()}`;

      let { x, y, width, height } = getDefaultPanelPosition(openPanels.length);

      if (dropCell && containerSize.width && containerSize.height) {
        const availableHeight = containerSize.height - NAV_BAR_HEIGHT;
        const pos = getGridCellPosition(
          dropCell.row,
          dropCell.col,
          containerSize.width,
          availableHeight,
          NAV_BAR_HEIGHT
        );
        width = Math.min(pos.width, containerSize.width);
        height = Math.min(pos.height, availableHeight);
        x = pos.x;
        y = pos.y;
      }

      setOpenPanels((prev) => [
        ...prev,
        {
          id,
          key: panelDef.key,
          title: panelDef.title,
          content: panelDef.content,
          x,
          y,
          width,
          height,
        },
      ]);
      setDragNavPanelKey(null);
    },
    [containerSize.height, containerSize.width, dropCell, openPanels.length]
  );

  const onMainDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => e.preventDefault(),
    []
  );

  // ---- panel handlers ----
  const handleClose = useCallback((id: string) => {
    setOpenPanels((panels) => panels.filter((p) => p.id !== id));
  }, []);

  const handlePanelMove = useCallback((id: string, dx: number, dy: number) => {
    setOpenPanels((panels) =>
      panels.map((p) => (p.id === id ? { ...p, x: p.x + dx, y: p.y + dy } : p))
    );
  }, []);

  const handlePanelResize = useCallback(
    (id: string, dw: number, dh: number) => {
      setOpenPanels((panels) =>
        panels.map((p) =>
          p.id === id
            ? {
                ...p,
                width: Math.max(200, p.width + dw),
                height: Math.max(100, p.height + dh),
              }
            : p
        )
      );
    },
    []
  );

  // ---- memoized nav list ----
  const navItems = useMemo(
    () =>
      panelList.map((panel) => (
        <NavItem
          key={panel.key}
          panelKey={panel.key}
          title={panel.title}
          icon={
            panel.key === "fruitbook" ? (
              <TermsIcon />
            ) : panel.key === "fruitview" ? (
              <FruitViewIcon />
            ) : panel.key === "about" ? (
              <AboutIcon />
            ) : null
          }
          draggingKey={dragNavPanelKey}
          onDragStart={onNavDragStart}
          onDragEnd={() => setDragNavPanelKey(null)}
        />
      )),
    [dragNavPanelKey, onNavDragStart]
  );

  return (
    <ThemeProvider mode={theme}>
      <div
        className={`app-root theme-${theme}`}
        style={{ display: "flex", height: "100vh" }}
      >
        {/* Navigation Bar */}
        {navOpen && (
          <nav style={navStyle}>
            <ul style={navListStyle}>{navItems}</ul>
          </nav>
        )}

        {/* Workspace */}
        <MainWorkspace
          onDrop={onMainDrop}
          onDragOver={onMainDragOver}
          onGridDropInfo={handleGridDropInfo}
          gridRows={GRID_ROWS}
          gridCols={GRID_COLS}
        >
          <main
            style={{
              flex: 1,
              position: "relative",
              background: "var(--background-color)",
              overflow: "hidden",
              height: "100%",
              width: "100%",
            }}
          >
            <TopBar
              navOpen={navOpen}
              toggleNav={() => setNavOpen((v) => !v)}
              theme={theme}
              onThemeToggle={toggleTheme}
            />

            {openPanels.length === 0 ? (
              <EmptyHint />
            ) : (
              openPanels.map((panel) => (
                <ResizableDraggablePanel
                  key={panel.id}
                  id={panel.id}
                  title={panel.title}
                  x={panel.x}
                  y={panel.y}
                  width={panel.width}
                  height={panel.height}
                  onClose={() => handleClose(panel.id)}
                  onMove={(dx, dy) => handlePanelMove(panel.id, dx, dy)}
                  onResize={(dw, dh) => handlePanelResize(panel.id, dw, dh)}
                  isDragging={activePanelId === panel.id}
                  onDragStart={() => setActivePanelId(panel.id)}
                  onDragEnd={() => setActivePanelId(null)}
                >
                  {panel.content}
                </ResizableDraggablePanel>
              ))
            )}
          </main>
        </MainWorkspace>
      </div>
    </ThemeProvider>
  );
};

/**********************
 * Presentational bits *
 **********************/
const EmptyHint: FC = () => (
  <div style={{ color: "#888", textAlign: "center", marginTop: "2rem" }}>
    No panels open.
    <br />
    Drag one from the navigation bar.
  </div>
);

interface TopBarProps {
  navOpen: boolean;
  toggleNav: () => void;
  theme: "dark" | "light";
  onThemeToggle: () => void;
}

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

/**********************
 * Root (login gate)   *
 **********************/
const Root: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  useEffect(() => {
    logoutIfInactive();
  }, []);

  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const handleLoginSuccess = () => {
    localStorage.setItem("isLoggedIn", "true");
    window.dispatchEvent(new Event("login-success"));
    forceUpdate();
  };

  useEffect(() => {
    const handler = () => setLoggedIn(isLoggedIn());
    window.addEventListener("login-success", handler);
    return () => window.removeEventListener("login-success", handler);
  }, []);

  if (!loggedIn) {
    return <LoginComponent onLoginSuccess={handleLoginSuccess} />;
  }
  return <App />;
};

export default Root;

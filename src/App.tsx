import React, { DragEvent, useCallback, useMemo, useState } from "react";
import ResizableDraggablePanel from "./components/ResizableDraggablePanel";
import TermsIcon from "./Icons/TermsIcon";
import AboutIcon from "./Icons/AboutIcon";
import FruitViewIcon from "./Icons/FruitViewIcon";
import { MainWorkspace } from "./components/MainWorkspace";
import { panelList } from "./panelList";
import { ThemeProvider } from "./components/ThemeProvider";
import { OpenPanel } from "./types/AppTypes";
import {
  getDefaultPanelPosition,
  NAV_BAR_HEIGHT,
  getGridCellPosition,
  GRID_ROWS,
  GRID_COLS,
} from "./utils/helper";
import useInactivityTimer from "./hooks/UseInactivityTimer";
import useTheme from "./hooks/UseThemeHook";
import NavItem from "./components/NavItem";
import EmptyHint from "./components/EmptyHint";
import TopBar from "./components/TopBar";

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

const App = () => {
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

export default App;

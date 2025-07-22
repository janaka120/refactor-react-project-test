import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const { makeDT, onGridDropInfoMock } = vi.hoisted(() => ({
  makeDT: () =>
    ({
      data: {},
      setData(type: string, val: string) {
        this.data[type] = val;
      },
      getData(type: string) {
        return this.data[type];
      },
      clearData: vi.fn(),
      dropEffect: "move",
      effectAllowed: "all",
      files: [],
      items: [],
      types: [],
    } as unknown as DataTransfer),
  onGridDropInfoMock: vi.fn(),
}));

vi.mock("../panelList", () => ({
  panelList: [
    { key: "about", title: "About", content: <div>About content</div> },
  ],
}));

vi.mock("../components/ResizableDraggablePanel", () => ({
  default: ({ id, title }: { id: string; title: string }) => (
    <div data-testid="panel" data-id={id}>
      {title}
    </div>
  ),
}));

vi.mock("../components/MainWorkspace", () => ({
  MainWorkspace: ({ children, onDrop, onDragOver, onGridDropInfo }: any) => {
    onGridDropInfoMock.mockImplementation(onGridDropInfo);
    return (
      <div
        data-testid="workspace"
        onDragOver={onDragOver}
        onDrop={onDrop}
        style={{ width: 800, height: 600 }}
      >
        {children}
      </div>
    );
  },
}));

vi.mock("../components/TopBar", () => ({
  default: ({
    navOpen,
    toggleNav,
    onThemeToggle,
  }: {
    navOpen: boolean;
    toggleNav: () => void;
    onThemeToggle: () => void;
  }) => (
    <div data-testid="topbar">
      <button aria-label="Toggle navigation" onClick={toggleNav}>
        {navOpen ? "CloseNav" : "OpenNav"}
      </button>
      <button onClick={onThemeToggle}>ToggleTheme</button>
    </div>
  ),
}));

vi.mock("../components/UserProfile", () => ({
  default: () => <div data-testid="user-profile" />,
}));

vi.mock("../components/ThemeProvider", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock("../components/NavItem", () => ({
  default: ({ panelKey, title, draggingKey, onDragStart, onDragEnd }: any) => (
    <li
      data-testid={`nav-item-${panelKey}`}
      draggable
      onDragStart={onDragStart(panelKey)}
      onDragEnd={onDragEnd}
      style={{ background: draggingKey === panelKey ? "#353b4a" : undefined }}
    >
      {title}
    </li>
  ),
}));

vi.mock("../components/EmptyHint", () => ({
  default: () => <div>No panels open.</div>,
}));

// Hooks: make them no-ops (no timers/confirm dialogs)
vi.mock("../hooks/UseInactivityTimer", () => ({
  default: () => {},
}));

vi.mock("../hooks/UseThemeHook", () => ({
  default: () => ({
    theme: "dark" as const,
    toggleTheme: vi.fn(),
  }),
}));

// ---------- import after mocks ----------
import App from "../App";
import React from "react";

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("shows EmptyHint initially", () => {
    render(<App />);
    expect(screen.getByText(/No panels open/i)).toBeInTheDocument();
  });

  it("toggles side nav", () => {
    render(<App />);
    const toggleBtn = screen.getByRole("button", {
      name: /toggle navigation/i,
    });

    // initially nav closed
    expect(screen.queryByTestId("nav-item-about")).not.toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.getByTestId("nav-item-about")).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.queryByTestId("nav-item-about")).not.toBeInTheDocument();
  });

  it("opens a panel when dragged from nav and dropped on workspace", async () => {
    render(<App />);

    // open nav
    fireEvent.click(screen.getByRole("button", { name: /toggle navigation/i }));
    const navItem = screen.getByTestId("nav-item-about");

    // simulate grid info update (MainWorkspace calls this normally during dragover)
    onGridDropInfoMock({
      cell: { row: 0, col: 0 },
      size: { width: 800, height: 600 },
    });

    // start dragging from nav
    const dt = makeDT();
    fireEvent.dragStart(navItem, { dataTransfer: dt });

    const workspace = screen.getByTestId("workspace");

    // drag over workspace
    fireEvent.dragOver(workspace, { dataTransfer: dt });

    // drop
    await act(async () => {
      fireEvent.drop(workspace, { dataTransfer: dt });
    });

    // panel should be rendered now
    expect(screen.getByTestId("panel")).toBeInTheDocument();
    expect(screen.getAllByText("About").length).toBeGreaterThan(0);
  });
});

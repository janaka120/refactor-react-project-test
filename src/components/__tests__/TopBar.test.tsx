import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// ---- mock BEFORE importing TopBar ----
const { mockUserProfile } = vi.hoisted(() => ({
  mockUserProfile: vi.fn(({ onThemeToggle }: { onThemeToggle: () => void }) => (
    <button data-testid="user-theme-btn" onClick={onThemeToggle}>
      Toggle Theme
    </button>
  )),
}));

vi.mock("../UserProfile", () => ({
  default: mockUserProfile,
}));

// import after mocks
import TopBar from "../TopBar";
import { NAV_BAR_HEIGHT } from "../../utils/helper";
import React from "react";

describe("TopBar", () => {
  const toggleNav = vi.fn();
  const onThemeToggle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderTopBar = (navOpen = false) =>
    render(
      <TopBar
        navOpen={navOpen}
        toggleNav={toggleNav}
        theme="dark"
        onThemeToggle={onThemeToggle}
      />
    );

  it("renders title and hamburger button (when nav is closed)", () => {
    renderTopBar(false);

    expect(screen.getByText(/fruteria/i)).toBeInTheDocument();

    const btn = screen.getByRole("button", { name: /toggle navigation/i });
    expect(btn).toBeInTheDocument();

    // Should show hamburger (rects) not the X (lines)
    expect(btn.querySelector("rect")).not.toBeNull();
    expect(btn.querySelector("line")).toBeNull();
  });

  it("renders X icon when nav is open", () => {
    renderTopBar(true);

    const btn = screen.getByRole("button", { name: /toggle navigation/i });
    // X icon uses <line> elements
    expect(btn.querySelectorAll("line").length).toBeGreaterThan(0);
    expect(btn.querySelector("rect")).toBeNull();
  });

  it("calls toggleNav on button click", () => {
    renderTopBar(false);
    const btn = screen.getByRole("button", { name: /toggle navigation/i });
    fireEvent.click(btn);
    expect(toggleNav).toHaveBeenCalledTimes(1);
  });

  it("passes onThemeToggle to UserProfile (mock) and triggers it", () => {
    renderTopBar();
    const themeBtn = screen.getByTestId("user-theme-btn");
    fireEvent.click(themeBtn);
    expect(onThemeToggle).toHaveBeenCalledTimes(1);
  });

  it("applies NAV_BAR_HEIGHT as minHeight on wrapper", () => {
    const { container } = renderTopBar();
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv).toHaveStyle(`min-height: ${NAV_BAR_HEIGHT}px`);
  });
});

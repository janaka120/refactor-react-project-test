import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const { isLoggedInMock, logoutIfInactiveMock } = vi.hoisted(() => ({
  isLoggedInMock: vi.fn<boolean, []>(() => false),
  logoutIfInactiveMock: vi.fn<void, []>(() => {}),
}));

vi.mock("../components/LoginComponent", () => ({
  default: ({ onLoginSuccess }: { onLoginSuccess: () => void }) => (
    <button onClick={onLoginSuccess}>Login Now</button>
  ),
}));

vi.mock("../App", () => ({
  default: () => <div data-testid="app-root">APP CONTENT</div>,
}));

vi.mock("../utils/authUtils", () => ({
  isLoggedIn: isLoggedInMock,
  logoutIfInactive: logoutIfInactiveMock,
}));

import Root from "../Root";
import React from "react";

describe("Root", () => {
  beforeEach(() => {
    localStorage.clear();
    // Don't restoreAllMocks here; it restores real impls.
    vi.clearAllMocks();
    isLoggedInMock.mockReset();
    logoutIfInactiveMock.mockReset();
  });

  it("renders App immediately if already logged in", async () => {
    isLoggedInMock.mockReturnValue(true);

    render(<Root />);

    expect(await screen.findByTestId("app-root")).toBeInTheDocument();
    expect(screen.queryByText("Login Now")).not.toBeInTheDocument();
  });

  it("renders LoginComponent when not logged in, then App after clicking login", async () => {
    isLoggedInMock.mockReturnValue(false);
    render(<Root />);

    const loginBtn = await screen.findByText("Login Now");
    fireEvent.click(loginBtn);

    // After click, your handler sets localStorage + dispatches event
    isLoggedInMock.mockReturnValue(true);
  });

  it("updates when 'login-success' event is dispatched", async () => {
    isLoggedInMock.mockReturnValue(false);
    render(<Root />);

    expect(screen.getByText("Login Now")).toBeInTheDocument();

    // Simulate external login
    localStorage.setItem("isLoggedIn", "true");
    isLoggedInMock.mockReturnValue(true);

    await act(async () => {
      window.dispatchEvent(new Event("login-success"));
    });

    expect(await screen.findByTestId("app-root")).toBeInTheDocument();
  });
});

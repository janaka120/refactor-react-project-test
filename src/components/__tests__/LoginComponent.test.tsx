import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginComponent from "../LoginComponent";

describe("LoginComponent", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {}, // Deprecated
        removeListener: () => {}, // Deprecated
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  });

  test("renders username, password fields and login button", () => {
    render(<LoginComponent />);
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("calls onLoginSuccess when valid credentials are submitted", async () => {
    const onLoginSuccess = vi.fn();
    render(<LoginComponent onLoginSuccess={onLoginSuccess} />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/username/i), "admin");
    await user.type(screen.getByPlaceholderText(/password/i), "1234");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(onLoginSuccess).toHaveBeenCalledTimes(1);
    });

    expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();
  });

  test("shows error message on invalid credentials", async () => {
    render(<LoginComponent />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/username/i), "wronguser");
    await user.type(screen.getByPlaceholderText(/password/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  test("shows validation error if username or password is empty", async () => {
    render(<LoginComponent />);
    const user = userEvent.setup();

    // Submit empty form
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(
      await screen.findByText(/please input your username/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/please input your password/i)
    ).toBeInTheDocument();
  });
});

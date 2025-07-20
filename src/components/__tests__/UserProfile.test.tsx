import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserProfile from "../UserProfile";

describe("UserProfile", () => {
  const mockOnLogout = vi.fn();
  const mockOnThemeToggle = vi.fn();

  beforeEach(() => {
    mockOnLogout.mockClear();
    mockOnThemeToggle.mockClear();
  });

  it("renders the user icon button initially", () => {
    render(<UserProfile onLogout={mockOnLogout} />);

    const userButton = screen.getByRole("button");
    expect(userButton).toBeInTheDocument();
  });

  it("does not render the UserPopover initially", () => {
    render(<UserProfile onLogout={mockOnLogout} />);

    expect(screen.queryByText(/User/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/user@email.com/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Do you want to log out?/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Log out/i })
    ).not.toBeInTheDocument();
  });

  it("opens the UserPopover when the user icon button is clicked", async () => {
    render(<UserProfile onLogout={mockOnLogout} />);

    const userButton = screen.getByRole("button");
    fireEvent.click(userButton);

    await waitFor(() => {
      expect(screen.getByText("User")).toBeInTheDocument();
      expect(screen.getByText(/user@email.com/i)).toBeInTheDocument();
      expect(screen.getByText(/Do you want to log out?/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Log out/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Cancel/i })
      ).toBeInTheDocument();
    });
  });

  it('closes the UserPopover when the "Cancel" button is clicked', async () => {
    render(<UserProfile onLogout={mockOnLogout} />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Cancel/i })
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));

    await waitFor(() => {
      expect(screen.queryByText(/User/i)).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Do you want to log out?/i)
      ).not.toBeInTheDocument();
    });
  });

  it('closes the UserPopover and calls onLogout when the "Log out" button is clicked', async () => {
    render(<UserProfile onLogout={mockOnLogout} />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Log out/i })
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Log out/i }));

    expect(mockOnLogout).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.queryByText(/User/i)).not.toBeInTheDocument();
    });
  });

  it("closes the UserPopover when clicking outside it (on the overlay)", async () => {
    render(<UserProfile onLogout={mockOnLogout} />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("User")).toBeInTheDocument();
    });

    const overlay = screen
      .getByText("User")
      .closest('div[style*="position: fixed"]');
    expect(overlay).toBeInTheDocument();

    fireEvent.click(overlay!);

    await waitFor(() => {
      expect(screen.queryByText(/User/i)).not.toBeInTheDocument();
    });
  });

  describe("Theme Toggle", () => {
    it("does not render theme toggle if onThemeToggle prop is not provided", () => {
      render(<UserProfile onLogout={mockOnLogout} />);
      fireEvent.click(screen.getByRole("button"));

      expect(screen.queryByRole("switch")).not.toBeInTheDocument();
      expect(screen.queryByText(/Theme/i)).not.toBeInTheDocument();
    });

    it("renders theme toggle if onThemeToggle prop is provided", async () => {
      render(
        <UserProfile
          onLogout={mockOnLogout}
          onThemeToggle={mockOnThemeToggle}
        />
      );
      fireEvent.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(screen.getByRole("switch")).toBeInTheDocument();
        expect(screen.getByText(/Theme/i)).toBeInTheDocument();
      });
    });

    it('displays "Light Theme" when theme prop is "dark"', async () => {
      render(
        <UserProfile
          onLogout={mockOnLogout}
          onThemeToggle={mockOnThemeToggle}
          theme="dark"
        />
      );
      fireEvent.click(screen.getByRole("button")); // Open popover

      await waitFor(() => {
        const themeText = screen.getByText("Light Theme"); // When dark, it says "Light Theme" to switch to
        expect(themeText).toBeInTheDocument();
        const themeSwitch = screen.getByRole("switch");
        expect(themeSwitch).toBeChecked(); // Ant Design switch is 'checked' when `checked` is true (for dark)
      });
    });

    it('displays "Dark Theme" when theme prop is "light"', async () => {
      render(
        <UserProfile
          onLogout={mockOnLogout}
          onThemeToggle={mockOnThemeToggle}
          theme="light"
        />
      );
      fireEvent.click(screen.getByRole("button"));

      await waitFor(() => {
        const themeText = screen.getByText("Dark Theme");
        expect(themeText).toBeInTheDocument();
        const themeSwitch = screen.getByRole("switch");
        expect(themeSwitch).not.toBeChecked();
      });
    });

    it("calls onThemeToggle when the theme switch is clicked", async () => {
      render(
        <UserProfile
          onLogout={mockOnLogout}
          onThemeToggle={mockOnThemeToggle}
          theme="light"
        />
      );
      fireEvent.click(screen.getByRole("button"));

      await waitFor(() => {
        const themeSwitch = screen.getByRole("switch");
        fireEvent.click(themeSwitch);
      });

      expect(mockOnThemeToggle).toHaveBeenCalledTimes(1);
    });
  });
});

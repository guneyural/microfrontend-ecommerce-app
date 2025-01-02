import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";
import { useAppDispatch, useAppSelector } from "host/hooks";
import { login } from "host/store/slices/authSlice";
import { mockNavigate } from "host/router";

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

// Mock dispatch
const mockDispatchResult = {
  unwrap: jest.fn(() => Promise.resolve()),
};
const mockDispatch = jest.fn(() => mockDispatchResult);

beforeEach(() => {
  jest.clearAllMocks();
  (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  (useAppSelector as jest.Mock).mockReturnValue({
    user: null,
    loading: false,
    error: null,
  });
});

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      error: null,
    });
  });

  it("renders login form", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("handles form submission", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(mockDispatch).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        login({
          email: "test@example.com",
          password: "password123",
        })
      );
    });

    expect(mockDispatchResult.unwrap).toHaveBeenCalled();
  });

  it("shows loading state", () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      user: null,
      loading: true,
      error: null,
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("shows error message", () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      error: "Invalid credentials",
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("redirects to home when user is already logged in", () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      user: { _id: "1", email: "test@example.com", name: "Test User" },
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});

import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Register from "./Register";
import { useAppDispatch, useAppSelector } from "host/hooks";
import { register } from "host/store/slices/authSlice";
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

describe("Register Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      error: null,
    });
  });

  it("renders register form", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  it("handles form submission", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        register({
          email: "test@example.com",
          password: "password123",
        })
      );
    });

    expect(mockDispatchResult.unwrap).toHaveBeenCalled();
  });

  it("shows validation error for password mismatch", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password456" },
    });
    fireEvent.click(submitButton);

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("shows loading state", () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      user: null,
      loading: true,
      error: null,
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("shows error message", () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      error: "Email already exists",
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByText("Email already exists")).toBeInTheDocument();
  });

  it("redirects to home when user is already logged in", () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      user: { _id: "1", email: "test@example.com", name: "Test User" },
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("validates required fields", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const form = screen.getByRole("form");
    form.setAttribute("novalidate", "true");

    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});

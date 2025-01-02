import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "./Navbar";

// Mock the hooks and router
const mockNavigate = jest.fn();
const mockSearchParams = new URLSearchParams();
const mockSetSearchParams = jest.fn();

jest.mock("react-router-dom", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => mockNavigate,
  useSearchParams: () => [mockSearchParams, mockSetSearchParams],
}));

const mockDispatch = jest.fn();
jest.mock("../store/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: () => ({
    user: null,
    isAuthenticated: false,
    items: [],
  }),
}));

describe("Navbar Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockDispatch.mockClear();
    mockSetSearchParams.mockClear();
  });

  it("renders logo and search bar", () => {
    render(<Navbar />);
    expect(screen.getByText("E-Commerce")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search products...")
    ).toBeInTheDocument();
  });

  it("handles search submission", () => {
    render(<Navbar />);
    const searchInput = screen.getByPlaceholderText("Search products...");

    fireEvent.change(searchInput, { target: { value: "test query" } });
    fireEvent.submit(searchInput.closest("form")!);

    expect(mockNavigate).toHaveBeenCalledWith("/search?q=test%20query");
  });

  it("shows cart items count", () => {
    jest.spyOn(require("../store/hooks"), "useAppSelector").mockReturnValue({
      user: null,
      isAuthenticated: false,
      items: [{ id: 1 }, { id: 2 }],
    });

    render(<Navbar />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("shows user menu when authenticated", () => {
    jest.spyOn(require("../store/hooks"), "useAppSelector").mockReturnValue({
      user: { email: "test@example.com" },
      isAuthenticated: true,
      items: [],
    });

    render(<Navbar />);
    expect(screen.getByText("Hi, test")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("handles logout", () => {
    jest.spyOn(require("../store/hooks"), "useAppSelector").mockReturnValue({
      user: { email: "test@example.com" },
      isAuthenticated: true,
      items: [],
    });

    render(<Navbar />);
    fireEvent.click(screen.getByText("Logout"));
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Object));
  });
});

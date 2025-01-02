import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CartScreen from "../Pages/CartScreen";
import { useAppDispatch, useAppSelector } from "host/hooks";

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock the dispatch function
const mockDispatch = jest.fn();

// Setup all mocks
beforeEach(() => {
  jest.clearAllMocks();
  (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
});

const mockCartItems = [
  {
    _id: "1",
    name: "Test Product",
    price: 99.99,
    quantity: 2,
    imageUrl: "test.jpg",
  },
];

// Helper function for rendering with router
const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("CartScreen Component", () => {
  beforeEach(() => {
    (useAppSelector as jest.Mock).mockReturnValue({
      items: mockCartItems,
      loading: false,
      error: null,
    });
  });

  it("renders cart items correctly", () => {
    renderWithRouter(<CartScreen />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(screen.getByTestId("quantity-1")).toHaveTextContent("2");
    expect(screen.getByTestId("subtotal-1")).toHaveTextContent("$199.98");
  });

  it("shows empty cart message when no items", () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      items: [],
      loading: false,
      error: null,
    });

    renderWithRouter(<CartScreen />);
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  it("handles quantity updates", () => {
    renderWithRouter(<CartScreen />);

    const increaseButton = screen.getByTestId("increase-quantity-1");
    fireEvent.click(increaseButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "cart/updateQuantity",
      payload: {
        id: {
          _id: "1",
          quantity: 3,
        },
        quantity: undefined,
      },
    });
  });

  it("handles item removal", () => {
    renderWithRouter(<CartScreen />);

    const removeButton = screen.getByTestId("remove-item-1");
    fireEvent.click(removeButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "cart/removeItem",
      payload: "1",
    });
  });

  it("shows loading state", () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      items: [],
      loading: true,
      error: null,
    });

    renderWithRouter(<CartScreen />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("shows error state", () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      items: [],
      loading: false,
      error: "Failed to fetch cart items",
    });

    renderWithRouter(<CartScreen />);
    expect(screen.getByText("Failed to fetch cart items")).toBeInTheDocument();
  });

  it("navigates to checkout when Proceed to Checkout is clicked", () => {
    renderWithRouter(<CartScreen />);

    const checkoutButton = screen.getByText("Proceed to Checkout");
    fireEvent.click(checkoutButton);

    expect(mockNavigate).toHaveBeenCalledWith("/orders/checkout");
  });

  it("navigates to home when Start Shopping is clicked in empty cart", () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      items: [],
      loading: false,
      error: null,
    });

    renderWithRouter(<CartScreen />);

    const startShoppingButton = screen.getByText("Start Shopping");
    fireEvent.click(startShoppingButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});

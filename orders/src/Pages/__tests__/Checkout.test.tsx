import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import Checkout from "../Checkout";
import { useAppDispatch, useAppSelector } from "host/hooks";
import { createOrder } from "host/store/slices/orderSlice";
import { clearCart } from "host/store/slices/cartSlice";

// Add TextEncoder polyfill if not available
if (typeof global.TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = require("util");
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock all the modules we need
jest.mock("react-router-dom");
jest.mock("host/hooks");
jest.mock("host/store/slices/orderSlice");
jest.mock("host/store/slices/cartSlice");

describe("Checkout Component", () => {
  const mockNavigate = jest.fn();
  const mockDispatchResult = {
    unwrap: () => Promise.resolve({ success: true }),
  };
  const mockDispatch = jest.fn(() => mockDispatchResult);

  const mockCartItems = [
    {
      _id: "1",
      name: "Test Product",
      price: 99.99,
      quantity: 2,
      imageUrl: "test.jpg",
    },
  ];

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Setup mocks
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      const state = {
        cart: { items: mockCartItems },
        orders: { loading: false, error: null },
      };
      return selector(state);
    });

    // Setup action creators
    (createOrder as jest.Mock).mockReturnValue(mockDispatchResult);
    (clearCart as jest.Mock).mockReturnValue({ type: "test/clearCart" });
  });

  it("renders checkout form correctly", () => {
    render(<Checkout />);

    expect(screen.getByText("Checkout")).toBeInTheDocument();
    expect(screen.getByLabelText(/street address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
  });

  it("displays cart items and total correctly", () => {
    render(<Checkout />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Quantity: 2")).toBeInTheDocument();
    const priceElements = screen.getAllByText("$199.98");
    expect(priceElements).toHaveLength(2);
  });

  it("handles form submission correctly", async () => {
    render(<Checkout />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/street address/i), {
      target: { value: "123 Test St" },
    });
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: "Test City" },
    });
    fireEvent.change(screen.getByLabelText(/state/i), {
      target: { value: "Test State" },
    });
    fireEvent.change(screen.getByLabelText(/zip code/i), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: "Test Country" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /create order/i }));

    await waitFor(() => {
      // Check if createOrder was called with correct data
      expect(createOrder).toHaveBeenCalledWith({
        products: [
          {
            _id: "1",
            quantity: 2,
            price: 99.99,
            name: "Test Product",
            image: "test.jpg",
          },
        ],
        shippingAddress: {
          street: "123 Test St",
          city: "Test City",
          state: "Test State",
          zipCode: "12345",
          country: "Test Country",
        },
      });

      expect(mockDispatch).toHaveBeenCalledTimes(2);
      expect(clearCart).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/orders");
    });
  });

  it("displays error message when there is an error", () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      const state = {
        cart: { items: mockCartItems },
        orders: { loading: false, error: "Test error message" },
      };
      return selector(state);
    });

    render(<Checkout />);
    expect(screen.getByText("Test error message")).toBeInTheDocument();
  });

  it("disables submit button when loading", () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      const state = {
        cart: { items: mockCartItems },
        orders: { loading: true, error: null },
      };
      return selector(state);
    });

    render(<Checkout />);
    expect(screen.getByRole("button", { name: /processing/i })).toBeDisabled();
  });
});

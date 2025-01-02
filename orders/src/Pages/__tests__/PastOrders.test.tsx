import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";
import PastOrders from "../PastOrders";
import { useAppDispatch, useAppSelector } from "host/hooks";
import { fetchOrders } from "host/store/slices/orderSlice";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("PastOrders Component", () => {
  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn();

  const mockOrders = [
    {
      _id: "1",
      createdAt: "2024-03-20T10:00:00.000Z",
      status: "delivered",
      products: [
        {
          _id: "prod1",
          name: "Test Product",
          price: 99.99,
          quantity: 1,
          image: "test.jpg",
        },
      ],
      totalAmount: 99.99,
      shippingAddress: {
        street: "123 Test St",
        city: "Test City",
        state: "Test State",
        zipCode: "12345",
        country: "Test Country",
      },
    },
  ];

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      orders: mockOrders,
      loading: false,
      error: null,
    }));

    mockDispatch.mockClear();
    mockNavigate.mockClear();
  });

  it("renders orders correctly", () => {
    render(<PastOrders />);

    expect(screen.getByText("Order History")).toBeInTheDocument();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
  });

  it("displays loading state", () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      orders: [],
      loading: true,
      error: null,
    }));

    render(<PastOrders />);

    expect(screen.queryByText("Order History")).not.toBeInTheDocument();
  });

  it("displays error state", () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      orders: [],
      loading: false,
      error: "Failed to fetch orders",
    }));

    render(<PastOrders />);

    expect(screen.getByText(/failed to fetch orders/i)).toBeInTheDocument();
  });

  it("navigates to product detail when clicking on product", async () => {
    const user = userEvent.setup();
    render(<PastOrders />);

    const productElement = screen.getByText("Test Product");
    await user.click(productElement);

    expect(mockNavigate).toHaveBeenCalledWith("/product/prod1");
  });

  it("fetches orders on mount", () => {
    render(<PastOrders />);

    expect(mockDispatch).toHaveBeenCalledWith(fetchOrders());
  });
});

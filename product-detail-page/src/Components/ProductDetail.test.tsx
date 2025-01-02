jest.mock("react-router-dom", () => ({
  __esModule: true,
  useParams: jest.fn(),
}));

jest.mock("host/hooks", () => ({
  __esModule: true,
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) => mockSelector(selector),
}));

jest.mock("host/store/slices/productSlice", () => ({
  __esModule: true,
  fetchProductById: (id: string) => ({
    type: "product/fetchById",
    payload: id,
  }),
}));

jest.mock("host/store/slices/cartSlice", () => ({
  __esModule: true,
  addItem: (item: any) => ({ type: "cart/addItem", payload: item }),
}));

jest.mock("host/utils", () => ({
  __esModule: true,
  formatPrice: (price: number) => `$${price.toFixed(2)}`,
  formatDate: (date: string) => new Date(date).toLocaleDateString(),
}));

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductDetail from "../Pages/ProductDetail";
import { useParams } from "react-router-dom";
import { mockProduct } from "../mocks/hostMocks";

const mockDispatch = jest.fn();
const mockSelector = jest.fn().mockReturnValue({
  product: {
    _id: "1",
    name: "Test Product",
    description: "Test Description",
    price: 99.99,
    category: "test",
    inStock: true,
    imageUrl: "test.jpg",
    createdAt: "2024-03-20",
    updatedAt: "2024-03-20",
  },
  loading: false,
  error: null,
});

describe("ProductDetail Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    mockSelector.mockReturnValue({
      product: {
        _id: "1",
        name: "Test Product",
        description: "Test Description",
        price: 99.99,
        category: "test",
        inStock: true,
        imageUrl: "test.jpg",
        createdAt: "2024-03-20",
        updatedAt: "2024-03-20",
      },
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.resetModules();
  });

  it("renders product details correctly", () => {
    render(<ProductDetail />);

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(
      screen.getByText(`Add to Cart - $${mockProduct.price.toFixed(2)}`)
    ).toBeInTheDocument();
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
  });

  it("shows loading state", () => {
    mockSelector.mockReturnValue({
      product: null,
      loading: true,
      error: null,
    });

    render(<ProductDetail />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockSelector.mockReturnValue({
      product: null,
      loading: false,
      error: "Failed to fetch product",
    });

    render(<ProductDetail />);
    expect(
      screen.getByText("An Error Occurred, Please Try Again")
    ).toBeInTheDocument();
    expect(screen.getByText("Failed to fetch product")).toBeInTheDocument();
  });

  it("fetches product on mount", () => {
    render(<ProductDetail />);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "product/fetchById",
      payload: "1",
    });
  });

  it("adds item to cart when Add to Cart is clicked", () => {
    render(<ProductDetail />);

    const addToCartButton = screen.getByTestId("add-to-cart-button");
    fireEvent.click(addToCartButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "cart/addItem",
      payload: {
        _id: "1",
        name: "Test Product",
        price: 99.99,
        quantity: 1,
        imageUrl: "test.jpg",
      },
    });
  });

  it("handles quantity changes", () => {
    render(<ProductDetail />);

    const decreaseButton = screen.getByTestId("decrease-quantity");
    const increaseButton = screen.getByTestId("increase-quantity");
    const addToCartButton = screen.getByTestId("add-to-cart-button");

    // Test increase
    fireEvent.click(increaseButton);
    expect(screen.getByTestId("quantity-display")).toHaveTextContent("2");
    expect(addToCartButton).toHaveTextContent(
      `Add to Cart - $${(99.99 * 2).toFixed(2)}`
    );

    // Test decrease
    fireEvent.click(decreaseButton);
    expect(screen.getByTestId("quantity-display")).toHaveTextContent("1");
    expect(addToCartButton).toHaveTextContent(
      `Add to Cart - $${(99.99).toFixed(2)}`
    );

    // Test minimum quantity
    fireEvent.click(decreaseButton);
    expect(screen.getByTestId("quantity-display")).toHaveTextContent("1");

    // Test maximum quantity
    for (let i = 0; i < 12; i++) {
      fireEvent.click(increaseButton);
    }
    expect(screen.getByTestId("quantity-display")).toHaveTextContent("10");
  });

  it("disables Add to Cart button when out of stock", () => {
    mockSelector.mockReturnValue({
      product: { ...mockProduct, inStock: false },
      loading: false,
      error: null,
    });

    render(<ProductDetail />);
    const addToCartButton = screen.getByTestId("add-to-cart-button");
    expect(addToCartButton).toBeDisabled();
    expect(addToCartButton).toHaveTextContent("Out of Stock");
  });
});

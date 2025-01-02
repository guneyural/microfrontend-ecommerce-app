import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductItem from "./ProductItem";
import { addItem } from "../store/slices/cartSlice";

// Mock the hooks and router
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

const mockDispatch = jest.fn();
jest.mock("../store/hooks", () => ({
  useAppDispatch: () => mockDispatch,
}));

describe("ProductItem Component", () => {
  const mockProduct = {
    _id: "1",
    name: "Test Product",
    description: "Test Description",
    price: 99.99,
    category: "test",
    inStock: true,
    imageUrl: "test.jpg",
    createdAt: "2024-03-20",
    updatedAt: "2024-03-20",
  };

  beforeEach(() => {
    mockNavigate.mockClear();
    mockDispatch.mockClear();
  });

  it("renders product information correctly", () => {
    render(<ProductItem product={mockProduct} />);

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
  });

  it("navigates to product detail on click", () => {
    render(<ProductItem product={mockProduct} />);
    const productElement = screen.getByTestId("product-item");

    fireEvent.click(productElement);
    expect(mockNavigate).toHaveBeenCalledWith(`/product/${mockProduct._id}`);
  });

  it("adds item to cart when Add to Cart is clicked", () => {
    render(<ProductItem product={mockProduct} />);

    fireEvent.click(screen.getByText("Add to Cart"));
    expect(mockDispatch).toHaveBeenCalledWith(
      addItem({
        _id: mockProduct._id,
        name: mockProduct.name,
        price: mockProduct.price,
        quantity: 1,
        imageUrl: mockProduct.imageUrl,
      })
    );
  });

  it("disables Add to Cart button when out of stock", () => {
    const outOfStockProduct = { ...mockProduct, inStock: false };
    render(<ProductItem product={outOfStockProduct} />);

    const button = screen.getByText("Add to Cart");
    expect(button).toBeDisabled();
  });
});

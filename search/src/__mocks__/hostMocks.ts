import React from "react";

// Mock hooks with proper Jest mock functions
export const useAppDispatch = jest.fn(() => jest.fn());
export const useAppSelector = jest.fn((selector) => selector);

// Mock components as default exports
const ProductItem = ({ product }: { product: any }) => (
  <div data-testid="product-item">{product.name}</div>
);

const HomeLayout = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="home-layout">{children}</div>
);

// Mock slice actions
export const searchProducts = jest.fn();
export const setFilter = jest.fn();
export const resetFilters = jest.fn();

// Export components with proper default exports
export const Components = {
  ProductItem,
  HomeLayout,
};

// Export each component with __esModule flag
export const ProductItemModule = {
  __esModule: true,
  default: ProductItem,
};

export const HomeLayoutModule = {
  __esModule: true,
  default: HomeLayout,
};

// Default export
export default {
  __esModule: true,
  ProductItem,
  HomeLayout,
};

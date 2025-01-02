import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { createStore } from "redux";
import SearchResults from "./SearchResults";
import { resetFilters, setFilter } from "host/store/slices/searchSlice";

// Mock functions
const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

// Mock initial state
const mockState = {
  search: {
    products: [
      { _id: "1", name: "Test Product 1", price: 100 },
      { _id: "2", name: "Test Product 2", price: 200 },
    ],
    loading: false,
    error: null,
    currentPage: 1,
    hasMore: false,
    filters: {
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: "createdAt:desc",
      inStock: undefined,
      isFilterOpen: false,
    },
  },
};

// Mocks at module level
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useSearchParams: () => [new URLSearchParams({ q: "test" })],
}));

// Create a mock selector function
let mockSelector = (state: any) => state;

jest.mock("host/hooks", () => ({
  useAppSelector: (selector: any) => selector(mockSelector(mockState)),
  useAppDispatch: () => mockDispatch,
}));

jest.mock("host/Components/ProductItem", () => ({
  __esModule: true,
  default: ({ product }: { product: any }) => (
    <div data-testid="product-item">{product.name}</div>
  ),
}));

jest.mock("host/Components/HomeLayout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="home-layout">{children}</div>
  ),
}));

describe("SearchResults", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock selector to use default state
    mockSelector = (state: any) => state;
  });

  const renderSearchResults = () => {
    return render(
      <Provider store={createStore((state = mockState) => state)}>
        <MemoryRouter>
          <SearchResults />
        </MemoryRouter>
      </Provider>
    );
  };

  test("renders search results with products", () => {
    renderSearchResults();

    expect(screen.getByText("Search Results for: test")).toBeInTheDocument();
    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    expect(screen.getByText("Test Product 2")).toBeInTheDocument();
  });

  test("handles filter changes", () => {
    renderSearchResults();

    const categorySelect = screen.getByRole("combobox", { name: /category/i });
    fireEvent.change(categorySelect, { target: { value: "Electronics" } });

    expect(mockDispatch).toHaveBeenCalledWith(
      setFilter({ key: "category", value: "Electronics" })
    );
  });

  test("handles sort change", () => {
    renderSearchResults();

    const sortSelect = screen.getByRole("combobox", { name: /sort by/i });
    fireEvent.change(sortSelect, { target: { value: "price:asc" } });

    expect(mockDispatch).toHaveBeenCalledWith(
      setFilter({ key: "sort", value: "price:asc" })
    );
  });

  test("shows loading spinner", () => {
    // Update the mock selector to return loading state
    mockSelector = () => ({
      search: {
        ...mockState.search,
        loading: true,
        products: [],
      },
    });

    render(
      <Provider store={createStore(() => mockState)}>
        <MemoryRouter>
          <SearchResults />
        </MemoryRouter>
      </Provider>
    );

    const loadingSpinner = screen.getByRole("status");
    expect(loadingSpinner).toBeInTheDocument();
    const spinnerLabel = screen.getByLabelText("Loading results");
    expect(spinnerLabel).toBeInTheDocument();
  });

  test("shows no products message when results are empty", () => {
    // Update the mock selector to return empty state
    mockSelector = () => ({
      search: {
        ...mockState.search,
        products: [],
        loading: false,
        error: null,
      },
    });

    render(
      <Provider store={createStore(() => mockState)}>
        <MemoryRouter>
          <SearchResults />
        </MemoryRouter>
      </Provider>
    );

    const heading = screen.getByRole("heading", {
      name: /no products found matching "test"/i,
    });
    expect(heading).toBeInTheDocument();

    expect(
      screen.getByText(
        "Try adjusting your search or filters to find what you're looking for"
      )
    ).toBeInTheDocument();
  });

  test("handles reset filters", () => {
    renderSearchResults();

    const resetButton = screen.getByRole("button", { name: /reset filters/i });
    fireEvent.click(resetButton);

    expect(mockDispatch).toHaveBeenCalledWith(resetFilters());
  });
});

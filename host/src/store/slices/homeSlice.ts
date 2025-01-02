import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product, PaginatedResponse } from "../../types/product";

interface HomeState {
  products: Product[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasMore: boolean;
  filters: {
    category: string;
    minPrice: string;
    maxPrice: string;
    sort: string;
    inStock: boolean | undefined;
    isFilterOpen: boolean;
  };
}

const initialState: HomeState = {
  products: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
  hasMore: true,
  filters: {
    category: "",
    minPrice: "",
    maxPrice: "",
    sort: "createdAt:desc",
    inStock: undefined,
    isFilterOpen: false,
  },
};

interface FilterParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  inStock?: boolean;
}

export const fetchProducts = createAsyncThunk<
  PaginatedResponse,
  FilterParams,
  { rejectValue: string }
>("home/fetchProducts", async (params, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();

    queryParams.append("page", params.page.toString());
    queryParams.append("limit", params.limit.toString());

    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params.minPrice)
      queryParams.append("minPrice", params.minPrice.toString());
    if (params.maxPrice)
      queryParams.append("maxPrice", params.maxPrice.toString());
    if (params.category)
      queryParams.append("category", params.category.toLowerCase());
    if (typeof params.inStock === "boolean")
      queryParams.append("inStock", params.inStock.toString());

    const response = await fetch(
      `http://localhost:8080/api/products?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch products"
    );
  }
});

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ key: string; value: any }>) => {
      const { key, value } = action.payload;
      (state.filters as any)[key] = value;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products =
          action.payload.page <= 1
            ? action.payload.products
            : [...state.products, ...action.payload.products];
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalProducts = action.payload.total;
        state.hasMore = action.payload.page < action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch products";
      });
  },
});

export const { setFilter, resetFilters } = homeSlice.actions;
export default homeSlice.reducer;
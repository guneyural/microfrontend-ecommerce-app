import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Product } from "../../types/product";

interface ProductState {
  product: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  product: null,
  loading: false,
  error: null,
};

export const fetchProductById = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("product/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`http://localhost:8080/api/products/${id}`);
    if (!response.ok) throw new Error("Product not found");
    return response.json();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch product"
    );
  }
});

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch product";
      });
  },
});

export default productSlice.reducer;

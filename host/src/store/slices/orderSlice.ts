import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface OrderState {
  loading: boolean;
  error: string | null;
  currentOrder: Order | null;
  orders: Order[];
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CreateOrderParams {
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const initialState: OrderState = {
  loading: false,
  error: null,
  currentOrder: null,
  orders: [],
};

export const createOrder = createAsyncThunk<
  Order,
  CreateOrderParams,
  { rejectValue: string }
>("orders/createOrder", async (orderData, { rejectWithValue }) => {
  try {
    const response = await fetch("http://localhost:8080/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to create order"
    );
  }
});

export const fetchOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("orders/fetchOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("http://localhost:8080/api/orders", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch orders"
    );
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create order";
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch orders";
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;

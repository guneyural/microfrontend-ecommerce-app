import orderReducer, {
  createOrder,
  fetchOrders,
  clearCurrentOrder,
} from "./orderSlice";

describe("Order Slice", () => {
  const initialState = {
    loading: false,
    error: null,
    currentOrder: null,
    orders: [],
  };

  const mockOrder = {
    _id: "1",
    userId: "user1",
    items: [
      {
        _id: "prod1",
        name: "Test Product",
        price: 99.99,
        quantity: 1,
        image: "test.jpg",
      },
    ],
    totalAmount: 99.99,
    status: "pending" as const,
    shippingAddress: {
      street: "123 Test St",
      city: "Test City",
      state: "Test State",
      zipCode: "12345",
      country: "Test Country",
    },
    createdAt: "2024-03-20",
    updatedAt: "2024-03-20",
  };

  it("should handle initial state", () => {
    expect(orderReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle clearCurrentOrder", () => {
    const state = {
      ...initialState,
      currentOrder: mockOrder,
    };
    expect(orderReducer(state, clearCurrentOrder())).toEqual({
      ...state,
      currentOrder: null,
    });
  });

  it("should handle createOrder.fulfilled", () => {
    expect(
      orderReducer(initialState, {
        type: createOrder.fulfilled.type,
        payload: mockOrder,
      })
    ).toEqual({
      ...initialState,
      currentOrder: mockOrder,
      orders: [mockOrder],
    });
  });

  it("should handle fetchOrders.fulfilled", () => {
    const mockOrders = [mockOrder, { ...mockOrder, _id: "2" }];
    expect(
      orderReducer(initialState, {
        type: fetchOrders.fulfilled.type,
        payload: mockOrders,
      })
    ).toEqual({
      ...initialState,
      orders: mockOrders,
    });
  });
});

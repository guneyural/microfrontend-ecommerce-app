import cartReducer, {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
} from "./cartSlice";

describe("Cart Slice", () => {
  const initialState = {
    items: [],
  };

  const mockItem = {
    _id: "1",
    name: "Test Product",
    price: 99.99,
    quantity: 1,
    imageUrl: "test.jpg",
  };

  it("should handle initial state", () => {
    expect(cartReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle addItem with new item", () => {
    expect(cartReducer(initialState, addItem(mockItem))).toEqual({
      items: [mockItem],
    });
  });

  it("should handle addItem with existing item", () => {
    const stateWithItem = {
      items: [mockItem],
    };
    expect(cartReducer(stateWithItem, addItem(mockItem))).toEqual({
      items: [{ ...mockItem, quantity: 2 }],
    });
  });

  it("should handle removeItem", () => {
    const stateWithItem = {
      items: [mockItem],
    };
    expect(cartReducer(stateWithItem, removeItem(mockItem._id))).toEqual({
      items: [],
    });
  });

  it("should handle updateQuantity", () => {
    const stateWithItem = {
      items: [mockItem],
    };
    expect(
      cartReducer(
        stateWithItem,
        updateQuantity({ _id: mockItem._id, quantity: 3 })
      )
    ).toEqual({
      items: [{ ...mockItem, quantity: 3 }],
    });
  });

  it("should handle clearCart", () => {
    const stateWithItems = {
      items: [mockItem, { ...mockItem, _id: "2" }],
    };
    expect(cartReducer(stateWithItems, clearCart())).toEqual(initialState);
  });
});

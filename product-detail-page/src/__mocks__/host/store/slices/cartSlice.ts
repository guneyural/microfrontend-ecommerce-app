// Mock the entire module as it's exposed from host
const cartSlice = {
  addItem: (item: any) => ({
    type: "cart/addItem",
    payload: item,
  }),
};

export default cartSlice;
// Re-export the named exports
export const { addItem } = cartSlice;

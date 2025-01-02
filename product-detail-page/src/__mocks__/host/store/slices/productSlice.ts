// Mock the entire module as it's exposed from host
const productSlice = {
  fetchProductById: (id: string) => ({
    type: "product/fetchById",
    payload: id,
  }),
};

export default productSlice;
// Re-export the named exports
export const { fetchProductById } = productSlice;

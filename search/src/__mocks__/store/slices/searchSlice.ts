export const searchProducts = jest.fn();
export const setFilter = jest.fn();
export const resetFilters = jest.fn(() => ({
  type: "search/resetFilters",
}));

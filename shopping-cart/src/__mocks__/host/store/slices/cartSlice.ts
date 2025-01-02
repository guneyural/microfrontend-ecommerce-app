export const removeItem = (id: string) => ({
  type: "cart/removeItem",
  payload: id,
});

export const updateQuantity = (id: string, quantity: number) => ({
  type: "cart/updateQuantity",
  payload: { id, quantity },
});

export const clearCart = () => ({
  type: "cart/clearCart",
});

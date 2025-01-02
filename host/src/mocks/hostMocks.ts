export const useAppDispatch = jest.fn();
export const useAppSelector = jest.fn();
export const formatPrice = (price: number) => `$${price.toFixed(2)}`;
export const clearCart = jest.fn();
export const createOrder = jest.fn();
export const fetchOrders = jest.fn();
export const logout = jest.fn();

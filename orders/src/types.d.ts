declare module "host/hooks" {
  export const useAppDispatch: () => any;
  export const useAppSelector: any;
}

declare module "host/store/slices/cartSlice" {
  export const addToCart: any;
  export const removeFromCart: any;
  export const updateQuantity: any;
  export const clearCart: any;
}

declare module "host/store/slices/orderSlice" {
  export const createOrder: any;
  export const fetchOrders: any;
}

declare module "host/store/slices/authSlice" {
  export const login: any;
  export const logout: any;
  export const register: any;
}

declare module "host/utils" {
  export const formatPrice: (price: number) => string;
}

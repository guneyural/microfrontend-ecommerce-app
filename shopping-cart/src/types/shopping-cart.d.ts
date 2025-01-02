declare module "host/utils" {
  export function formatPrice(price: number): string;
  export function formatDate(date: Date): string;
}

declare module "host/hooks" {
  import { TypedUseSelectorHook } from "react-redux";
  import { RootState, AppDispatch } from "host/store";

  export const useAppDispatch: () => AppDispatch;
  export const useAppSelector: TypedUseSelectorHook<RootState>;
}

declare module "host/store" {
  export interface RootState {
    cart: {
      items: CartItem[];
      loading: boolean;
      error: string | null;
    };
  }
  export type AppDispatch = () => any;
}

declare module "host/store/slices/cartSlice" {
  export interface CartItem {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }

  export function removeItem(id: string): { type: string; payload: string };
  export function updateQuantity(
    id: string,
    quantity: number
  ): {
    type: string;
    payload: { id: string; quantity: number };
  };
  export function clearCart(): { type: string };
}

declare module "host/router" {
  export { useNavigate, Link, NavLink } from "react-router-dom";
}

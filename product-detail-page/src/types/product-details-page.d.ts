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
    product: {
      product: any;
      loading: boolean;
      error: string | null;
    };
  }
  export type AppDispatch = () => any;
}

declare module "host/store/slices/cartSlice" {
  export function addItem(item: {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }): { type: string; payload: any };
}

declare module "host/store/slices/productSlice" {
  export function fetchProductById(id: string): {
    type: string;
    payload: string;
  };
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

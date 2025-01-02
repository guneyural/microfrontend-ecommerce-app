declare module "host/router" {
  export { useNavigate, useParams } from "react-router-dom";
}

declare module "host/utils" {
  export function formatPrice(price: number): string;
  export function formatDate(date: string): string;
}

declare module "host/hooks" {
  export function useAppDispatch(): any;
  export function useAppSelector<T>(selector: (state: any) => T): T;
}

declare module "host/store/slices/cartSlice" {
  export interface CartItem {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }

  export function removeItem(_id: string): any;
  export function updateQuantity(data: {
    _id: string;
    quantity: number;
  }): any;
  export function clearCart(): any;
}

declare module "host/store/hooks" {
  export function useAppDispatch(): any;
  export function useAppSelector<T>(selector: (state: any) => T): T;
}

declare module "host/types" {
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
}

declare module "host/store/slices/productSlice" {
  export function fetchProductById(id: string): Product;
}

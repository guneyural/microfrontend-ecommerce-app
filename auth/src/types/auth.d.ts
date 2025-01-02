declare module "host/utils" {
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
    auth: {
      user: User | null;
      loading: boolean;
      error: string | null;
    };
  }
  export type AppDispatch = <T>(action: T) => Promise<T> & {
    unwrap: () => Promise<void>;
  };
}

declare module "host/store/slices/authSlice" {
  export interface User {
    _id: string;
    email: string;
    name: string;
  }

  export interface LoginCredentials {
    email: string;
    password: string;
  }

  export interface RegisterCredentials extends LoginCredentials {}

  export const login: (credentials: LoginCredentials) => any;
  export const register: (credentials: RegisterCredentials) => any;
  export const logout: () => any;
}

declare module "host/router" {
  const mockNavigate: jest.Mock;
  export const useNavigate: () => typeof mockNavigate;
  export { Link, NavLink } from "react-router-dom";
  export { mockNavigate };
}

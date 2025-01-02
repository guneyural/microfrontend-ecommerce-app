declare module "host/router" {
  export { useNavigate } from "react-router-dom";
}

declare module "host/hooks" {
  export function useAppDispatch(): any;
  export function useAppSelector<T>(selector: (state: any) => T): T;
}

declare module "host/store/slices/authSlice" {
  export function login(credentials: { email: string; password: string }): any;
  export function register(credentials: {
    email: string;
    password: string;
  }): any;
}

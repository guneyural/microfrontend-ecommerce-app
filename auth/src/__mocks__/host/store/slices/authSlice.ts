export const login = jest.fn().mockReturnValue({
  type: "auth/login",
  payload: undefined,
});

export const register = jest.fn().mockReturnValue({
  type: "auth/register",
  payload: undefined,
});

export const logout = jest.fn().mockReturnValue({
  type: "auth/logout",
  payload: undefined,
});

// Export types from the original module
export type {
  User,
  LoginCredentials,
  RegisterCredentials,
} from "host/store/slices/authSlice";

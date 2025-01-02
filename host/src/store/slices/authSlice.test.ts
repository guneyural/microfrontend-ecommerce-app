import authReducer, { login, logout, register } from "./authSlice";

describe("Auth Slice", () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  const mockUser = {
    _id: "1",
    email: "test@example.com",
    name: "Test User",
  };

  it("should handle login.fulfilled", () => {
    expect(
      authReducer(initialState, {
        type: login.fulfilled.type,
        payload: { user: mockUser, token: "test-token" },
      })
    ).toEqual({
      ...initialState,
      user: mockUser,
      token: "test-token",
      isAuthenticated: true,
    });
  });

  it("should handle logout", () => {
    const loggedInState = {
      ...initialState,
      user: mockUser,
      token: "test-token",
      isAuthenticated: true,
    };

    expect(authReducer(loggedInState, logout())).toEqual(initialState);
  });

  it("should handle register.fulfilled", () => {
    expect(
      authReducer(initialState, {
        type: register.fulfilled.type,
        payload: { user: mockUser, token: "test-token" },
      })
    ).toEqual({
      ...initialState,
      user: mockUser,
      token: "test-token",
      isAuthenticated: true,
    });
  });
});

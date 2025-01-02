import React, { useState, useEffect } from "react";
import { useNavigate } from "host/router";
import { useAppDispatch, useAppSelector } from "host/hooks";
import { login } from "host/store/slices/authSlice";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector((state: any) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();
      navigate("/", { replace: true });
    } catch (err) {
      // Error handling is done through the redux state
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div
          data-testid="loading-spinner"
          className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-3xl font-bold text-center">Sign in</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Sign in
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/auth/register"
              className="text-sm text-blue-400 hover:text-black transition-colors"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from "react";
import { useNavigate } from "host/router";
import { useAppDispatch, useAppSelector } from "host/hooks";
import { register } from "host/store/slices/authSlice";
import { Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector((state: any) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError("");

    // Manually check form validity
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      const emailInput = form.elements.namedItem("email") as HTMLInputElement;
      const passwordInput = form.elements.namedItem(
        "password"
      ) as HTMLInputElement;

      if (!emailInput.value) {
        setValidationError("Email is required");
        return;
      }
      if (!passwordInput.value) {
        setValidationError("Password is required");
        return;
      }
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    try {
      await dispatch(register({ email, password })).unwrap();
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
          <h2 className="text-3xl font-bold text-center">Create Account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} role="form">
          {(error || validationError) && (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-sm text-red-700">{error || validationError}</p>
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
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Sign up
            </button>
          </div>
          <div className="text-center">
            <Link
              to="/auth/login"
              className="text-sm text-blue-400 hover:text-black transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

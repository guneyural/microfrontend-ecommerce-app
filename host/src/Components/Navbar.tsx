import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { logout } from "../store/slices/authSlice";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="text-lg md:text-2xl font-bold text-black mr-8"
          >
            E-Commerce
          </Link>

          <div className="flex-1 max-w-2xl mr-4 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                🔍
              </button>
            </form>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <span className="relative">
                🛒
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </span>
              <span className="ml-2">Cart</span>
            </Link>

            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 hidden lg:block">
                  Hi, {user.email.split("@")[0]}
                </span>

                <Link
                  to="/orders"
                  className="items-center text-gray-700 hover:text-gray-900"
                >
                  <span>Orders</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-sm bg-red-500 text-white p-1 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth/register"
                  className="text-sm bg-black text-white p-2 rounded-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-900">404</h1>
        <p className="mt-4 text-xl text-gray-600">Page not found</p>
        <Link
          to="/"
          className="mt-8 inline-block px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-900 transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";

const MainLayout = () => {
  return (
    <>
      <Navbar />

      <div className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;

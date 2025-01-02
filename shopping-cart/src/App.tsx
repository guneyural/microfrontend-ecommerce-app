import React from "react";
import { Routes, Route } from "react-router-dom";
import CartScreen from "./Pages/CartScreen";
import "./index.scss";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<CartScreen />} />
    </Routes>
  );
};

export default App;

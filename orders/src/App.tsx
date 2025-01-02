import React from "react";
import { Routes, Route } from "react-router-dom";
import "./index.scss";
import Checkout from "./Pages/Checkout";
import PastOrders from "./Pages/PastOrders";

const App = () => (
  <Routes>
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/" element={<PastOrders />} />
  </Routes>
);

export default App;

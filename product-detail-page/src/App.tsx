import "./index.scss";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProductDetail from "./Pages/ProductDetail";

const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/" replace />} />
    <Route path="/:id" element={<ProductDetail />} />
  </Routes>
);

export default App;

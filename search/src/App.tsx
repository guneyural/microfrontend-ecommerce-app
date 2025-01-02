import "./index.scss";
import React from "react";
import { Routes, Route } from "react-router-dom";
import SearchResults from "./Pages/SearchResults";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SearchResults />} />
    </Routes>
  );
};

export default App;

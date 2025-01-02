import React, { Suspense, lazy } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store, persistor } from "./store";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./Components/ProtectedRoute";
import NotFound from "./Pages/NotFound";

const Home = lazy(() => import("./Pages/Home"));
const ProductDetail = lazy(() => import("product-detail/App"));
const ShoppingCart = lazy(() => import("shopping-cart/App"));
const Auth = lazy(() => import("auth/App"));
const Search = lazy(() => import("search/App"));
const Orders = lazy(() => import("orders/App"));

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="product/*" element={<ProductDetail />} />
              <Route path="cart/*" element={<ShoppingCart />} />
              <Route path="search/*" element={<Search />} />
              <Route
                path="auth/*"
                element={
                  <ProtectedRoute guestOnly>
                    <Auth />
                  </ProtectedRoute>
                }
              />
              <Route
                path="orders/*"
                element={
                  <ProtectedRoute authOnly>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

export default App;

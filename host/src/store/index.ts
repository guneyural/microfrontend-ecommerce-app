import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartReducer from "./slices/cartSlice";
import authReducer from "./slices/authSlice";
import homeReducer from "./slices/homeSlice";
import productReducer from "./slices/productSlice";
import searchReducer from "./slices/searchSlice";
import orderReducer from "./slices/orderSlice";

const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["items", "isOpen"],
};

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token", "isAuthenticated"],
};

export const store = configureStore({
  reducer: {
    cart: persistReducer(cartPersistConfig, cartReducer),
    auth: persistReducer(authPersistConfig, authReducer),
    home: homeReducer,
    product: productReducer,
    search: searchReducer,
    orders: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

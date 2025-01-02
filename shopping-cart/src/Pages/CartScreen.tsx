import React from "react";
import { useAppDispatch, useAppSelector } from "host/hooks";
import { clearCart } from "host/store/slices/cartSlice";
import { formatPrice } from "host/utils";
import { useNavigate } from "react-router-dom";
import CartItem from "../Components/CartItem";
import type { CartItem as CartItemType } from "host/store/slices/cartSlice";

const CartScreen = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useAppSelector((state) => state.cart);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const totalQuantity = items.reduce(
    (sum: number, item: CartItemType) => sum + item.quantity,
    0
  );

  const totalAmount = items.reduce(
    (sum: number, item: CartItemType) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate("/orders/checkout");
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 p-4 rounded-md max-w-lg">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p
                data-testid="error-message"
                className="text-sm text-red-700 mt-1"
              >
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-8">
          Start shopping to add items to your cart
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-40">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={handleClearCart}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear Cart
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-4">
          {items.map((item: CartItemType) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">
                  Total ({totalQuantity}{" "}
                  {totalQuantity === 1 ? "item" : "items"})
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(totalAmount)}
                </p>
              </div>
              <button
                onClick={handleCheckout}
                className="bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-900 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;

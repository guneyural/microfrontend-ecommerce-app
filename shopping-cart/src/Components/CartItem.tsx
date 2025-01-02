import React from "react";
import { useAppDispatch } from "host/hooks";
import { removeItem, updateQuantity } from "host/store/slices/cartSlice";
import { formatPrice } from "host/utils";
import type { CartItem as CartItemType } from "host/store/slices/cartSlice";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const dispatch = useAppDispatch();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > 10) return;

    dispatch(updateQuantity({ _id: item._id, quantity: newQuantity }));
  };

  return (
    <div className="flex items-center p-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors">
      <div className="w-24 h-24 flex-shrink-0 mr-6">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
        <p className="text-gray-600">{formatPrice(item.price)}</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
            data-testid={`decrease-quantity-${item._id}`}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>
          <span
            data-testid={`quantity-${item._id}`}
            className="w-8 text-center"
          >
            {item.quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= 10}
            data-testid={`increase-quantity-${item._id}`}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
        <div
          data-testid={`subtotal-${item._id}`}
          className="w-24 text-right font-medium"
        >
          {formatPrice(item.price * item.quantity)}
        </div>
        <button
          onClick={() => dispatch(removeItem(item._id))}
          data-testid={`remove-item-${item._id}`}
          className="p-2 text-gray-400 hover:text-red-500"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default CartItem;

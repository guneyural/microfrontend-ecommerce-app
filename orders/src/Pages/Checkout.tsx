import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "host/hooks";
import { createOrder } from "host/store/slices/orderSlice";
import { clearCart } from "host/store/slices/cartSlice";

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const { loading, error } = useAppSelector((state) => state.orders);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(
        createOrder({
          products: items.map((item) => ({
            _id: item._id,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            image: item.imageUrl,
          })),
          shippingAddress,
        })
      ).unwrap();

      dispatch(clearCart());
      navigate("/orders");
    } catch (err) {
      console.error("Failed to create order:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700"
              >
                Street Address
              </label>
              <input
                id="street"
                type="text"
                name="street"
                value={shippingAddress.street}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                placeholder="Enter your street address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  placeholder="Enter your city"
                />
              </div>
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <input
                  id="state"
                  type="text"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  placeholder="Enter your state"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="zipCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  ZIP Code
                </label>
                <input
                  id="zipCode"
                  type="text"
                  name="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  placeholder="Enter your ZIP code"
                />
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  placeholder="Enter your country"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item._id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>
                  $
                  {items
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:bg-gray-400"
        >
          {loading ? "Processing..." : "Create Order"}
        </button>
      </form>
    </div>
  );
}

export default Checkout;

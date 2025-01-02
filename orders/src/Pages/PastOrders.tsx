import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "host/hooks";
import { useNavigate } from "react-router-dom";
import { fetchOrders } from "host/store/slices/orderSlice";
import { formatPrice } from "host/utils";

function PastOrders() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-0 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-600">No orders found</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Order ID: {order._id}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium mb-2">Items</h3>
                  <div className="space-y-3">
                    {order.products.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        onClick={() => handleProductClick(item._id)}
                      >
                        <div className="flex items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="ml-4">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Amount:</span>
                    <span className="font-bold text-lg">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4">
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.street}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zipCode}
                    <br />
                    {order.shippingAddress.country}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PastOrders;

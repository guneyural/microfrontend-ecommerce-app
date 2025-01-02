import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatPrice, formatDate } from "host/utils";
import { useAppDispatch, useAppSelector } from "host/hooks";
import { addItem } from "host/store/slices/cartSlice";
import { fetchProductById } from "host/store/slices/productSlice";
import "../styles/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { product, loading, error } = useAppSelector(
    (state: any) => state.product
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  if (error)
    return (
      <div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-red-50 p-4 rounded-md max-w-lg">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  An Error Occurred, Please Try Again
                </h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  const handleAddToCart = () => {
    dispatch(
      addItem({
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        imageUrl: product.imageUrl,
      })
    );
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (value > 10) return;
    setQuantity(value);
  };

  return (
    <div className="container mx-auto">
      {loading && (
        <div className="flex justify-center items-center py-4">
          <div
            data-testid="loading-spinner"
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
          />
        </div>
      )}

      {product && (
        <div className="product-container">
          <div className="product-section">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-auto max-h-[520px] object-cover rounded-lg"
            />
          </div>

          <div className="product-section">
            <div className="flex flex-col space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-2xl font-semibold text-blue-600">
                  {formatPrice(product.price)}
                </p>
              </div>

              <div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                    ${
                      product.inStock
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-900 mb-2">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-900 mb-2">
                  Category
                </h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {product.category}
                </span>
              </div>

              <div className="text-sm text-gray-500">
                <p>Added {formatDate(new Date(product.createdAt))}</p>
                <p>Last updated {formatDate(new Date(product.updatedAt))}</p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-900 mb-3">
                  Quantity
                </h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    data-testid="decrease-quantity"
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span
                    data-testid="quantity-display"
                    className="text-lg font-medium text-gray-900"
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 10}
                    data-testid="increase-quantity"
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                data-testid="add-to-cart-button"
                disabled={!product.inStock}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors
                  ${
                    product.inStock
                      ? "bg-black hover:bg-gray-900"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                {product.inStock
                  ? `Add to Cart - ${formatPrice(product.price * quantity)}`
                  : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "host/hooks";
import { addItem } from "host/store/slices/cartSlice";
import { fetchProductById } from "host/store/slices/productSlice";
import { formatPrice } from "host/utils";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { product, loading, error } = useAppSelector((state) => state.product);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addItem({
          _id: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
        })
      );
    }
  };

  if (loading) {
    return <div role="status">Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
          <p className="text-lg text-gray-700 mb-4">{product.description}</p>
          <div className="mb-6">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          </div>
          <div className="mb-6">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
              {product.category}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full py-3 px-8 rounded-lg text-white font-medium ${
              product.inStock
                ? "bg-black hover:bg-gray-800"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

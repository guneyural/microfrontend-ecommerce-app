import React from "react";
import { useAppDispatch } from "../store/hooks";
import { addItem } from "../store/slices/cartSlice";
import { Product } from "../types/product";
import { formatPrice } from "../utils/formatters";
import { useNavigate } from "react-router-dom";

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(
      addItem({
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl,
      })
    );
  };

  return (
    <div
      data-testid="product-item"
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full cursor-pointer transition-transform hover:scale-[1.02]"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 flex-1">
              {product.name}
            </h3>
            <span className="text-lg font-bold text-gray-900 ml-2">
              {formatPrice(product.price)}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-4">{product.description}</p>

          <div className="flex items-center mb-3">
            <span className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-700 capitalize">
              {product.category}
            </span>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full py-2 px-4 rounded-lg text-sm font-medium text-white transition-colors mt-auto ${
            product.inStock
              ? "bg-black hover:bg-gray-800"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductItem;

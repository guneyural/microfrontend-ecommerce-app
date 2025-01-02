import React from "react";

const ProductItem = ({ product }: { product: any }) => (
  <div data-testid="product-item">{product.name}</div>
);

export default ProductItem;

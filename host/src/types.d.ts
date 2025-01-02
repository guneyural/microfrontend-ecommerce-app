declare module "product-detail/App" {
  const ProductDetail: () => JSX.Element;
  export default ProductDetail;
}

declare module "shopping-cart/App" {
  const ShoppingCart: React.ComponentType;
  export default ShoppingCart;
}

declare module "auth/App" {
  const Auth: React.ComponentType;
  export default Auth;
}

declare module "search/App" {
  const Search: React.ComponentType;
  export default Search;
}

declare module "orders/App" {
  const Orders: React.ComponentType;
  export default Orders;
}

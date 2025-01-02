declare module "host/hooks" {
  export const useAppDispatch: () => any;
  export const useAppSelector: any;
}

declare module "host/store/slices/searchSlice" {
  export const searchProducts: any;
  export const setFilter: any;
  export const resetFilters: any;
}

declare module "host/Components/ProductItem" {
  const ProductItem: React.ComponentType<{ product: any }>;
  export default ProductItem;
}

declare module "host/Components/HomeLayout" {
  const HomeLayout: React.ComponentType<{ children: React.ReactNode }>;
  export default HomeLayout;
}

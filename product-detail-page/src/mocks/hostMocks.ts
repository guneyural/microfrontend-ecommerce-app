import { Product } from "../types/product-details-page";

// Create an action creator that matches Redux Toolkit's createAsyncThunk
export const fetchProductById = jest.fn((id: string) => ({
  type: "product/fetchProductById",
  payload: id,
}));

export const addItem = jest.fn(
  (item: { _id: string; name: string; price: number; quantity: number }) => ({
    type: "cart/addItem",
    payload: item,
  })
);

export const useAppDispatch = jest.fn();
export const useAppSelector = jest.fn();

export const formatPrice = (price: number) => `$${price.toFixed(2)}`;
export const formatDate = (date: string) => new Date(date).toLocaleDateString();

export const mockProduct: Product = {
  _id: "1",
  name: "Test Product",
  description: "Test Description",
  price: 99.99,
  category: "test",
  inStock: true,
  imageUrl: "test.jpg",
  createdAt: "2024-03-20",
  updatedAt: "2024-03-20",
};

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse {
  products: Product[];
  totalPages: number;
  page: number;
  total: number;
}

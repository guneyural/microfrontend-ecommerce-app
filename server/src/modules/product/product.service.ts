import { Product } from "./product.model";

interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  inStock?: boolean;
  search?: string;
}

interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const getProducts = async (
  filterOptions: FilterOptions,
  paginationOptions: PaginationOptions
) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = paginationOptions;

  const skip = (Number(page) - 1) * Number(limit);

  const query: any = {};

  if (filterOptions.minPrice || filterOptions.maxPrice) {
    query.price = {};
    if (filterOptions.minPrice) query.price.$gte = filterOptions.minPrice;
    if (filterOptions.maxPrice) query.price.$lte = filterOptions.maxPrice;
  }

  if (filterOptions.category) {
    query.category = filterOptions.category;
  }

  if (filterOptions.inStock !== undefined) {
    query.inStock = filterOptions.inStock;
  }

  if (filterOptions.search) {
    query.$or = [
      { name: { $regex: filterOptions.search, $options: "i" } },
      { description: { $regex: filterOptions.search, $options: "i" } },
    ];
  }

  const total = await Product.countDocuments(query);

  const sortConfig: any = {
    [sortBy]: sortOrder === "desc" ? -1 : 1,
    _id: 1,
  };

  const products = await Product.find(query)
    .sort(sortConfig)
    .skip(skip)
    .limit(Number(limit))
    .lean();

  return {
    products,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    total,
  };
};

export const getProductById = async (id: string) => {
  return Product.findById(id);
};

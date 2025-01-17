import React, { useEffect, useRef, useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchProducts,
  setFilter,
  resetFilters,
} from "../store/slices/homeSlice";
import ProductItem from "../Components/ProductItem";
import HomeLayout from "../Components/HomeLayout";
import { useNavigate } from "react-router-dom";
import "../styles/products.css";

const categories = ["Electronics", "Clothing", "Books", "Sports", "Toys"];

const sortOptions = [
  { value: "createdAt:desc", label: "Newest First" },
  { value: "createdAt:asc", label: "Oldest First" },
  { value: "price:asc", label: "Price: Low to High" },
  { value: "price:desc", label: "Price: High to Low" },
];

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { products, loading, error, currentPage, hasMore, filters } =
    useAppSelector((state) => state.home);

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setFilter({ key, value }));
  };

  const applyFilters = useCallback(() => {
    const [sortBy, sortOrder] = filters.sort.split(":");
    dispatch(
      fetchProducts({
        page: 1,
        limit: 12,
        sortBy,
        sortOrder: sortOrder as "asc" | "desc",
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        category: filters.category || undefined,
        inStock: filters.inStock,
      })
    );
  }, [dispatch, filters]);

  const handleResetFilters = () => {
    dispatch(resetFilters());
    dispatch(fetchProducts({ page: 1, limit: 12 }));
  };

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          dispatch(fetchProducts({ page: currentPage + 1, limit: 12 }));
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, currentPage, dispatch]
  );

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    navigate(`/search?q=${searchQuery}`);
  };

  if (error)
    return (
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
    );

  return (
    <HomeLayout>
      <div className="filter-toggle">
        <button
          onClick={() =>
            handleFilterChange("isFilterOpen", !filters.isFilterOpen)
          }
          className="w-full py-2 px-4 bg-gray-100 rounded-lg flex items-center justify-between"
        >
          <span>Filters</span>
          <span>{filters.isFilterOpen ? "↑" : "↓"}</span>
        </button>
      </div>

      <div className={`filter-sidebar ${filters.isFilterOpen ? "show" : ""}`}>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Sort By</h3>
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Category</h3>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Price Range</h3>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              className="w-1/2 p-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              className="w-1/2 p-2 border rounded-md"
            />
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Availability</h3>
          <select
            value={
              filters.inStock === undefined ? "" : filters.inStock.toString()
            }
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange(
                "inStock",
                value === "" ? undefined : value === "true"
              );
            }}
            className="w-full p-2 border rounded-md"
          >
            <option value="">All</option>
            <option value="true">In Stock</option>
            <option value="false">Out of Stock</option>
          </select>
        </div>

        <button
          onClick={handleResetFilters}
          className="w-full py-2 px-4 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
        >
          Reset Filters
        </button>
      </div>

      <div className="flex-1">
        <div className="md:hidden">
          <form onSubmit={handleSearch} className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              🔍
            </button>
          </form>
        </div>

        <div className="search-container">
          {products.map((product, index) => (
            <div
              key={product._id}
              ref={index === products.length - 1 ? lastProductRef : undefined}
            >
              <ProductItem product={product} />
            </div>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}

        {!hasMore && products.length > 0 && (
          <div className="text-center text-gray-600 py-4">
            No more products to load
          </div>
        )}
      </div>
    </HomeLayout>
  );
};

export default Home;

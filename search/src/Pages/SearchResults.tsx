import "../styles/SearchResults.css";
import React, { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "host/hooks";
import {
  searchProducts,
  setFilter,
  resetFilters,
} from "host/store/slices/searchSlice";
import ProductItem from "host/Components/ProductItem";
import HomeLayout from "host/Components/HomeLayout";

const categories = ["Electronics", "Clothing", "Books", "Sports", "Toys"];

const sortOptions = [
  { value: "createdAt:desc", label: "Newest First" },
  { value: "createdAt:asc", label: "Oldest First" },
  { value: "price:asc", label: "Price: Low to High" },
  { value: "price:desc", label: "Price: High to Low" },
];

const SearchResults = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { products, loading, error, currentPage, hasMore, filters } =
    useAppSelector((state: any) => state.search);

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(query);

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setFilter({ key, value }));
  };

  const applyFilters = useCallback(() => {
    const [sortBy, sortOrder] = filters.sort.split(":");
    dispatch(
      searchProducts({
        page: 1,
        limit: 12,
        query,
        sortBy,
        sortOrder: sortOrder as "asc" | "desc",
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        category: filters.category || undefined,
        inStock: filters.inStock,
      })
    );
  }, [dispatch, filters, query]);

  const handleResetFilters = () => {
    dispatch(resetFilters());
    dispatch(searchProducts({ page: 1, limit: 12, query }));
  };

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    if (query === "") navigate("/");
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    navigate(`/search?q=${searchQuery}`);
  };

  const observer = useRef<IntersectionObserver | null>(null);

  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const [sortBy, sortOrder] = filters.sort.split(":");
          dispatch(
            searchProducts({
              page: currentPage + 1,
              limit: 12,
              query,
              sortBy,
              sortOrder: sortOrder as "asc" | "desc",
              minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
              maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
              category: filters.category || undefined,
              inStock: filters.inStock,
            })
          );
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, currentPage, dispatch, filters, query]
  );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 p-4 rounded-md max-w-lg">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                An Error Occurred
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

      <div className={`filter-sidebar ${filters.isFilterOpen ? "show" : ""}`}>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Sort By</h3>
          <select
            aria-label="Sort by"
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
            aria-label="Category"
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
        <h2 className="text-2xl font-bold mb-6">Search Results for: {query}</h2>

        {loading && products.length === 0 && (
          <div className="flex py-4 w-full items-center justify-center">
            <div
              role="status"
              aria-label="Loading results"
              className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
            >
              <span className="sr-only">Loading results...</span>
            </div>
          </div>
        )}

        <div className="search-container">
          {products.length > 0 &&
            products.map((product: any, index: number) => (
              <div
                key={product._id}
                ref={index === products.length - 1 ? lastProductRef : undefined}
              >
                <ProductItem product={product} />
              </div>
            ))}
        </div>

        {!loading && products.length === 0 && (
          <div className="w-full flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2
                className="text-2xl font-semibold mb-4"
                role="heading"
                aria-level={2}
              >
                No products found matching "{query}"
              </h2>
              <p className="text-gray-600">
                Try adjusting your search or filters to find what you're looking
                for
              </p>
            </div>
          </div>
        )}

        {loading && products.length > 0 && (
          <div className="flex py-4 w-full items-center justify-center">
            <div
              role="status"
              aria-label="Loading more results"
              className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
            >
              <span className="sr-only">Loading more results...</span>
            </div>
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

export default SearchResults;

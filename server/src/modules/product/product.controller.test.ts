import { Request, Response } from "express";
import { list, getById } from "./product.controller";
import * as productService from "./product.service";

jest.mock("./product.service");

describe("Product Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      query: {},
      params: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("list", () => {
    it("should return products with default pagination", async () => {
      const mockProducts = {
        products: [{ id: "1", name: "Test Product" }],
        total: 1,
        page: 1,
        totalPages: 1,
      };

      (productService.getProducts as jest.Mock).mockResolvedValue(mockProducts);

      await list(mockReq as Request, mockRes as Response);

      expect(productService.getProducts).toHaveBeenCalledWith(
        {},
        { page: 1, limit: 10, sortOrder: "desc" }
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockProducts);
    });

    it("should handle query parameters correctly", async () => {
      mockReq.query = {
        page: "2",
        limit: "20",
        minPrice: "10",
        maxPrice: "100",
        category: "electronics",
        inStock: "true",
        search: "test",
      };

      await list(mockReq as Request, mockRes as Response);

      expect(productService.getProducts).toHaveBeenCalledWith(
        {
          minPrice: 10,
          maxPrice: 100,
          category: "electronics",
          inStock: true,
          search: "test",
        },
        { page: 2, limit: 20, sortOrder: "desc" }
      );
    });
  });

  describe("getById", () => {
    it("should return 404 if product not found", async () => {
      mockReq.params = { id: "nonexistent" };
      (productService.getProductById as jest.Mock).mockResolvedValue(null);

      await getById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Product not found",
      });
    });

    it("should return product if found", async () => {
      mockReq.params = { id: "123" };
      const mockProduct = { id: "123", name: "Test Product" };
      (productService.getProductById as jest.Mock).mockResolvedValue(
        mockProduct
      );

      await getById(mockReq as Request, mockRes as Response);

      expect(mockRes.json).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe("error handling", () => {
    it("should handle service errors in list", async () => {
      (productService.getProducts as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await list(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Database error",
      });
    });

    it("should handle invalid query parameters", async () => {
      mockReq.query = {
        page: "invalid",
        limit: "invalid",
        minPrice: "invalid",
        maxPrice: "invalid",
      };

      await list(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });

    it("should handle service errors in getById", async () => {
      mockReq.params = { id: "123" };
      (productService.getProductById as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await getById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Database error",
      });
    });
  });
});

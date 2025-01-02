import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { getProducts, getProductById } from "./product.service";
import { Product } from "./product.model";

describe("Product Service", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  const createSampleProducts = async () => {
    const products = [
      {
        name: "Laptop",
        description: "Powerful laptop",
        price: 999.99,
        category: "electronics",
        inStock: true,
        imageUrl: "laptop.jpg",
      },
      {
        name: "Smartphone",
        description: "Latest smartphone",
        price: 599.99,
        category: "electronics",
        inStock: true,
        imageUrl: "phone.jpg",
      },
      {
        name: "Headphones",
        description: "Wireless headphones",
        price: 199.99,
        category: "electronics",
        inStock: false,
        imageUrl: "headphones.jpg",
      },
    ];

    await Product.insertMany(products);
  };

  describe("getProducts", () => {
    beforeEach(async () => {
      await createSampleProducts();
    });

    it("should return paginated products", async () => {
      const result = await getProducts({}, { page: 1, limit: 2 });

      expect(result.products).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.totalPages).toBe(2);
    });

    it("should filter by price range", async () => {
      const result = await getProducts(
        { minPrice: 500, maxPrice: 1000 },
        { page: 1, limit: 10 }
      );

      expect(result.products).toHaveLength(2);
      expect(result.products[0].price).toBeGreaterThanOrEqual(500);
      expect(result.products[0].price).toBeLessThanOrEqual(1000);
    });

    it("should filter by category", async () => {
      const result = await getProducts(
        { category: "electronics" },
        { page: 1, limit: 10 }
      );

      expect(result.products).toHaveLength(3);
      expect(result.products[0].category).toBe("electronics");
    });

    it("should filter by stock status", async () => {
      const result = await getProducts(
        { inStock: true },
        { page: 1, limit: 10 }
      );

      expect(result.products).toHaveLength(2);
      expect(result.products[0].inStock).toBe(true);
    });

    it("should search by name or description", async () => {
      const result = await getProducts(
        { search: "laptop" },
        { page: 1, limit: 10 }
      );

      expect(result.products).toHaveLength(1);
      expect(result.products[0].name).toBe("Laptop");
    });
  });

  describe("getProductById", () => {
    let productId: string;

    beforeEach(async () => {
      const product = await Product.create({
        name: "Test Product",
        description: "Test Description",
        price: 99.99,
        category: "test",
        inStock: true,
        imageUrl: "test.jpg",
      });
      productId = product._id.toString();
    });

    it("should return product by id", async () => {
      const product = await getProductById(productId);

      expect(product).toBeTruthy();
      expect(product?.name).toBe("Test Product");
    });

    it("should return null for non-existent product", async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const product = await getProductById(nonExistentId);

      expect(product).toBeNull();
    });
  });
});

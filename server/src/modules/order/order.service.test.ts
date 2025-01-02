import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createOrder, getOrders, getUserOrders } from "./order.service";
import { Order } from "./order.model";

describe("Order Service", () => {
  let mongoServer: MongoMemoryServer;
  const userId = new mongoose.Types.ObjectId().toString();

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
    await Order.deleteMany({});
  });

  const sampleOrder = {
    products: [
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "Test Product",
        price: 99.99,
        quantity: 2,
        image: "test.jpg",
      },
    ],
    shippingAddress: {
      street: "123 Test St",
      city: "Test City",
      state: "Test State",
      zipCode: "12345",
      country: "Test Country",
    },
  };

  describe("createOrder", () => {
    it("should create a new order", async () => {
      const order = await createOrder(userId, sampleOrder);

      expect(order.userId.toString()).toBe(userId);
      expect(order.products).toHaveLength(1);
      expect(order.totalAmount).toBe(199.98); // 99.99 * 2
      expect(order.status).toBe("pending");
      expect(order.shippingAddress).toEqual(sampleOrder.shippingAddress);
    });

    it("should calculate total amount correctly with multiple products", async () => {
      const orderWithMultipleProducts = {
        ...sampleOrder,
        products: [
          ...sampleOrder.products,
          {
            _id: new mongoose.Types.ObjectId().toString(),
            name: "Another Product",
            price: 49.99,
            quantity: 3,
            image: "another.jpg",
          },
        ],
      };

      const order = await createOrder(userId, orderWithMultipleProducts);

      // 99.99 * 2 + 49.99 * 3
      expect(order.totalAmount).toBe(349.95);
    });
  });

  describe("getOrders", () => {
    beforeEach(async () => {
      // Create multiple orders for testing with delay between them
      await createOrder(userId, sampleOrder);
      // Add a small delay to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 100));
      await createOrder(userId, sampleOrder);
      await createOrder(new mongoose.Types.ObjectId().toString(), sampleOrder); // Different user
    });

    it("should return orders for specific user", async () => {
      const orders = await getOrders(userId);

      expect(orders).toHaveLength(2);
      orders.forEach((order) => {
        expect(order.userId.toString()).toBe(userId);
      });
    });

    it("should sort orders by createdAt in descending order", async () => {
      const orders = await getOrders(userId);

      expect(orders).toHaveLength(2);
      expect(orders[0].createdAt).toBeInstanceOf(Date);
      expect(orders[1].createdAt).toBeInstanceOf(Date);
      // Compare timestamps
      const firstOrderTime = orders[0].createdAt.getTime();
      const secondOrderTime = orders[1].createdAt.getTime();
      expect(firstOrderTime).toBeGreaterThan(secondOrderTime);
    });
  });

  describe("getUserOrders", () => {
    beforeEach(async () => {
      // Create multiple orders for pagination testing
      const orderPromises = Array.from({ length: 15 }, () =>
        createOrder(userId, sampleOrder)
      );
      await Promise.all(orderPromises);
    });

    it("should return paginated orders", async () => {
      const result = await getUserOrders(userId, {
        page: 1,
        limit: 10,
      });

      expect(result.orders).toHaveLength(10);
      expect(result.total).toBe(15);
      expect(result.totalPages).toBe(2);
      expect(result.page).toBe(1);
    });

    it("should handle custom sort options", async () => {
      const result = await getUserOrders(userId, {
        page: 1,
        limit: 10,
        sortBy: "totalAmount",
        sortOrder: "asc",
      });

      expect(result.orders).toBeDefined();
      const amounts = result.orders.map((order) => order.totalAmount);
      expect(amounts).toEqual([...amounts].sort((a, b) => a - b));
    });

    it("should return empty array when no orders exist", async () => {
      await Order.deleteMany({}); // Clear all orders

      const result = await getUserOrders(userId, {
        page: 1,
        limit: 10,
      });

      expect(result.orders).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });

    it("should handle invalid page numbers gracefully", async () => {
      const result = await getUserOrders(userId, {
        page: 999,
        limit: 10,
      });

      expect(result.orders).toHaveLength(0);
      expect(result.total).toBe(15);
      expect(result.totalPages).toBe(2);
      expect(result.page).toBe(999);
    });
  });
});

import { Request, Response } from "express";
import { createOrderController, getOrdersController } from "./order.controller";
import * as orderService from "./order.service";
import { validateCreateOrder } from "./order.validator";

jest.mock("./order.service");
jest.mock("./order.validator");

describe("Order Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        user: { _id: "123" },
      },
    };
    jest.clearAllMocks();
  });

  describe("createOrderController", () => {
    const validOrderData = {
      products: [
        {
          _id: "123",
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

    it("should return 400 if validation fails", async () => {
      mockReq.body = {};
      (validateCreateOrder as jest.Mock).mockReturnValue({
        error: { details: [{ message: "Validation error" }] },
      });

      await createOrderController(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Validation error",
      });
    });

    it("should create order successfully", async () => {
      mockReq.body = validOrderData;
      const mockOrder = { _id: "order123", ...validOrderData };

      (validateCreateOrder as jest.Mock).mockReturnValue({ error: null });
      (orderService.createOrder as jest.Mock).mockResolvedValue(mockOrder);

      await createOrderController(mockReq as Request, mockRes as Response);

      expect(orderService.createOrder).toHaveBeenCalledWith(
        mockRes.locals?.user?._id,
        validOrderData
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockOrder);
    });

    it("should handle service errors", async () => {
      mockReq.body = validOrderData;
      (validateCreateOrder as jest.Mock).mockReturnValue({ error: null });

      (orderService.createOrder as jest.Mock).mockImplementation(() =>
        Promise.reject(new Error("Service error"))
      );

      await createOrderController(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error creating order",
      });
    });
  });

  describe("getOrdersController", () => {
    it("should return user orders", async () => {
      const mockOrders = [
        { _id: "order1", totalAmount: 199.98 },
        { _id: "order2", totalAmount: 299.97 },
      ];

      (orderService.getOrders as jest.Mock).mockResolvedValue(mockOrders);

      await getOrdersController(mockReq as Request, mockRes as Response);

      expect(orderService.getOrders).toHaveBeenCalledWith(
        mockRes.locals?.user?._id
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockOrders);
    });

    it("should handle service errors", async () => {
      (orderService.getOrders as jest.Mock).mockImplementation(() =>
        Promise.reject(new Error("Service error"))
      );

      await getOrdersController(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error fetching orders",
      });
    });
  });
});

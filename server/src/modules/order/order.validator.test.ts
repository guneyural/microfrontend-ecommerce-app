import { validateCreateOrder } from "./order.validator";
import mongoose from "mongoose";

describe("Order Validator", () => {
  const validOrder = {
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

  it("should validate a correct order", () => {
    const { error } = validateCreateOrder(validOrder);
    expect(error).toBeUndefined();
  });

  it("should require products array", () => {
    const { error } = validateCreateOrder({
      ...validOrder,
      products: undefined,
    });
    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain('"products" is required');
  });

  it("should require at least one product", () => {
    const { error } = validateCreateOrder({
      ...validOrder,
      products: [],
    });
    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain(
      '"products" must contain at least 1 items'
    );
  });

  it("should validate product quantity", () => {
    const { error } = validateCreateOrder({
      ...validOrder,
      products: [
        {
          ...validOrder.products[0],
          quantity: 0,
        },
      ],
    });
    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain(
      '"products[0].quantity" must be greater than or equal to 1'
    );
  });

  it("should require all shipping address fields", () => {
    const { error } = validateCreateOrder({
      ...validOrder,
      shippingAddress: {
        ...validOrder.shippingAddress,
        street: undefined,
      },
    });
    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain(
      '"shippingAddress.street" is required'
    );
  });

  it("should validate product price as number", () => {
    const { error } = validateCreateOrder({
      ...validOrder,
      products: [
        {
          ...validOrder.products[0],
          price: "invalid",
        },
      ],
    });
    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain(
      '"products[0].price" must be a number'
    );
  });
});

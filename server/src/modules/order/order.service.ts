import { Order } from "./order.model";
import mongoose from "mongoose";

interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface CreateOrderInput {
  products: Array<{
    _id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export const getUserOrders = async (
  userId: string,
  paginationOptions: PaginationOptions
) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = paginationOptions;
  const skip = (page - 1) * limit;

  const query = { userId: new mongoose.Types.ObjectId(userId) };

  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);

  return {
    orders,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getOrderById = async (orderId: string, userId: string) => {
  return Order.findOne({
    _id: orderId,
    userId: new mongoose.Types.ObjectId(userId),
  });
};

export const createOrder = async (
  userId: string,
  orderData: CreateOrderInput
) => {
  const totalAmount = orderData.products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = new Order({
    userId,
    products: orderData.products.map((product) => ({
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      image: product.image,
    })),
    totalAmount,
    shippingAddress: orderData.shippingAddress,
  });

  await order.save();
  return order;
};

export const getOrders = async (userId: string) => {
  return Order.find({ userId }).sort({ createdAt: -1 });
};

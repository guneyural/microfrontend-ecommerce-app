import { Request, Response } from "express";
import { createOrder, getOrders } from "./order.service";
import { validateCreateOrder } from "./order.validator";

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const { error } = validateCreateOrder(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userId = res.locals?.user?._id;
    const order = await createOrder(userId, req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error creating order" });
  }
};

export const getOrdersController = async (req: Request, res: Response) => {
  try {
    const userId = res.locals?.user?._id;
    const orders = await getOrders(userId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

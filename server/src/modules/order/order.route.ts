import express from "express";
import { getOrdersController, createOrderController } from "./order.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, getOrdersController);
router.post("/", authMiddleware, createOrderController);

export default router;

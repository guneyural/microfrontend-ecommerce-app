import express, { Express } from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./modules/auth/auth.route";
import productRoutes from "./modules/product/product.route";
import orderRoutes from "./modules/order/order.route";
import { authMiddleware } from "./middleware/auth.middleware";

const app: Express = express();
const port = process.env.PORT || 8080;

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://username:DvXKfV1c4UBBSUzH@test.1hhcn.mongodb.net/?retryWrites=true&w=majority&appName=test";
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", authMiddleware, orderRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

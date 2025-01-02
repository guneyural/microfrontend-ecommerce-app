import mongoose from "mongoose";
import { Product } from "../product.model";
import { mockProducts } from "./products";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://username:DvXKfV1c4UBBSUzH@test.1hhcn.mongodb.net/?retryWrites=true&w=majority&appName=test";

const seedProducts = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    await Product.deleteMany({});
    await Product.insertMany(mockProducts);
    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedProducts();

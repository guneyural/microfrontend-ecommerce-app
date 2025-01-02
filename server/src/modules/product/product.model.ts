import mongoose from "mongoose";

export type ProductDocument = mongoose.Document & {
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);

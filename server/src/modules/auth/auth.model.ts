import mongoose from "mongoose";

export type UserDocument = mongoose.Document & {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

import { User, UserDocument } from "./auth.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "ECOMMERCE_MICRO_FRONTEND_SECRET";

export const createUser = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
  });
  return user;
};

export const validateUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
};

export const generateToken = (user: UserDocument) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "24h" });
};

export const isEmailTaken = async (email: string) => {
  const user = await User.findOne({ email });
  return !!user;
};

import { Request, Response } from "express";
import {
  createUser,
  validateUser,
  generateToken,
  isEmailTaken,
} from "./auth.service";
import { UserDocument } from "./auth.model";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const emailTaken = await isEmailTaken(email);
    if (emailTaken)
      return res.status(400).json({ message: "Email already exists" });

    const user = await createUser(email, password);
    const token = generateToken(user.toObject() as UserDocument);

    res.status(201).json({ token });
  } catch (error: any) {
    res.status(500).json({ message: "Error creating user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await validateUser(email, password);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.toObject() as UserDocument);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

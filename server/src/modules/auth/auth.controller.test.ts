import { Request, Response } from "express";
import { register, login } from "./auth.controller";
import * as authService from "./auth.service";
import { UserDocument } from "./auth.model";
import mongoose from "mongoose";

jest.mock("./auth.service");

describe("Auth Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  const createMockUser = (data: Partial<UserDocument> = {}): UserDocument => {
    return {
      _id: new mongoose.Types.ObjectId(),
      email: "test@test.com",
      password: "hashedPassword",
      createdAt: new Date(),
      updatedAt: new Date(),
      toObject: () => ({
        _id: data._id || new mongoose.Types.ObjectId(),
        email: data.email || "test@test.com",
      }),
      ...data,
    } as UserDocument;
  };

  describe("register", () => {
    it("should return 400 if email or password is missing", async () => {
      await register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Email and password are required",
      });
    });

    it("should return 400 if email is already taken", async () => {
      mockReq.body = { email: "test@test.com", password: "password" };
      (authService.isEmailTaken as jest.Mock).mockResolvedValue(true);

      await register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Email already exists",
      });
    });

    it("should create user and return token on success", async () => {
      mockReq.body = { email: "test@test.com", password: "password" };
      const mockUser = createMockUser();
      const mockToken = "token123";

      (authService.isEmailTaken as jest.Mock).mockResolvedValue(false);
      (authService.createUser as jest.Mock).mockResolvedValue(mockUser);
      (authService.generateToken as jest.Mock).mockReturnValue(mockToken);

      await register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ token: mockToken });
    });
  });

  describe("login", () => {
    it("should return 400 if email or password is missing", async () => {
      await login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Email and password are required",
      });
    });

    it("should return 401 if credentials are invalid", async () => {
      mockReq.body = { email: "test@test.com", password: "password" };
      (authService.validateUser as jest.Mock).mockResolvedValue(null);

      await login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Invalid credentials",
      });
    });

    it("should return token on successful login", async () => {
      mockReq.body = { email: "test@test.com", password: "password" };
      const mockUser = createMockUser();
      const mockToken = "token123";

      (authService.validateUser as jest.Mock).mockResolvedValue(mockUser);
      (authService.generateToken as jest.Mock).mockReturnValue(mockToken);

      await login(mockReq as Request, mockRes as Response);

      expect(mockRes.json).toHaveBeenCalledWith({ token: mockToken });
    });
  });
});

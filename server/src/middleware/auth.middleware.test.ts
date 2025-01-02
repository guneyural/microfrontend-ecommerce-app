import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "./auth.middleware";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("Auth Middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {
        authorization: undefined,
      },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {} as { user: any },
    };
    mockNext = jest.fn();
  });

  it("should return 401 if no authorization header", () => {
    authMiddleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 if authorization header does not start with Bearer", () => {
    mockReq = {
      headers: {
        authorization: "Invalid token",
      },
    };

    authMiddleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  });

  it("should return 401 if token is invalid", () => {
    mockReq = {
      headers: {
        authorization: "Bearer invalid_token",
      },
    };
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authMiddleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid token" });
  });

  it("should call next() if token is valid", () => {
    mockReq = {
      headers: {
        authorization: "Bearer valid_token",
      },
    };
    const decodedToken = { userId: "123" };
    (jwt.verify as jest.Mock).mockReturnValue(decodedToken);

    authMiddleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.locals?.user).toEqual(decodedToken);
    expect(mockNext).toHaveBeenCalled();
  });
});

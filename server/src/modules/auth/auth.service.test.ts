import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createUser, validateUser, isEmailTaken } from "./auth.service";
import { User } from "./auth.model";

describe("Auth Service", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("createUser", () => {
    it("should create a new user with hashed password", async () => {
      const email = "test@example.com";
      const password = "password123";

      const user = await createUser(email, password);

      expect(user.email).toBe(email);
      expect(user.password).not.toBe(password); // Password should be hashed
      expect(user.password).toHaveLength(60); // bcrypt hash length
    });

    it("should throw error if email already exists", async () => {
      const email = "test@example.com";
      const password = "password123";

      await createUser(email, password);

      await expect(createUser(email, password)).rejects.toThrow();
    });
  });

  describe("validateUser", () => {
    it("should return user if credentials are valid", async () => {
      const email = "test@example.com";
      const password = "password123";

      await createUser(email, password);

      const user = await validateUser(email, password);
      expect(user).toBeTruthy();
      expect(user?.email).toBe(email);
    });

    it("should return null if email does not exist", async () => {
      const user = await validateUser("nonexistent@example.com", "password123");
      expect(user).toBeNull();
    });

    it("should return null if password is incorrect", async () => {
      const email = "test@example.com";
      await createUser(email, "password123");

      const user = await validateUser(email, "wrongpassword");
      expect(user).toBeNull();
    });
  });

  describe("isEmailTaken", () => {
    it("should return true if email exists", async () => {
      const email = "test@example.com";
      await createUser(email, "password123");

      const result = await isEmailTaken(email);
      expect(result).toBe(true);
    });

    it("should return false if email does not exist", async () => {
      const result = await isEmailTaken("nonexistent@example.com");
      expect(result).toBe(false);
    });
  });
});

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import * as authController from "../../src/modules/auth/auth.controller.js";
import userModel from "../../DB/models/user.model.js";
import { AppError } from "../../AppError.js";

jest.mock("../../DB/models/user.model.js");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.setTimeout(150000); // 60 ثانية

describe("Auth Controller - Unit Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("SignUp", () => {
    it("should return error if email already exists", async () => {
      userModel.findOne.mockResolvedValue({ email: "test@test.com" });

      const req = { body: { email: "test@test.com" } };
      const res = {};
      const next = jest.fn();

      await authController.SignUp(req, res, next);

      expect(next).toHaveBeenCalledWith(new AppError("Email already exists", 409));
    });
  });

  describe("SignIn", () => {
    it("should return error if email not found", async () => {
      userModel.findOne.mockResolvedValue(null);

      const req = { body: { email: "notfound@test.com", password: "123" } };
      const res = {};
      const next = jest.fn();

      await authController.SignIn(req, res, next);

      expect(next).toHaveBeenCalledWith(new AppError("Email not found", 404));
    });

    it("should return error if password mismatch", async () => {
      userModel.findOne.mockResolvedValue({ email: "test@test.com", password: "hashed", confirmEmail: true });
      bcrypt.compare.mockResolvedValue(false);

      const req = { body: { email: "test@test.com", password: "wrong" } };
      const res = {};
      const next = jest.fn();

      await authController.SignIn(req, res, next);

      expect(next).toHaveBeenCalledWith(new AppError("Invalid password", 401));
    });
  });

  describe("refresh", () => {
    it("should return error if no refresh token", async () => {
      const req = { body: {} };
      const res = {};
      const next = jest.fn();

      await authController.refresh(req, res, next);

      expect(next).toHaveBeenCalledWith(new AppError("Refresh token is required", 401));
    });
  });
});

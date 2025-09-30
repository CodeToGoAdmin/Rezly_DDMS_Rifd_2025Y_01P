import { jest } from "@jest/globals";
import bcrypt from "bcryptjs";
import userModel from "../../DB/models/user.model.js";
import Role from "../../DB/models/role.model.js";
import * as employeesController from "../../src/modules/employees/employees.controller.js";
import { AppError } from "../../AppError.js";

// Mock modules
jest.mock("../../DB/models/user.model.js");
jest.mock("../../DB/models/role.model.js");
jest.mock("bcryptjs");

describe("Employees Controller Unit Tests", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("listEmployees", () => {
    test("should return all employees", async () => {
      const mockEmployees = [{ _id: "1", userName: "John" }];
      userModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockEmployees),
      });

      await employeesController.listEmployees(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: mockEmployees,
      });
    });

    test("should call next on error", async () => {
      const error = new Error("DB error");
      userModel.find.mockImplementation(() => {
        throw error;
      });

      await employeesController.listEmployees(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("createEmployee", () => {
    test("should create employee successfully", async () => {
      req.body = {
        userName: "Alice",
        email: "a@a.com",
        password: "123",
        roleId: "role1",
      };

      userModel.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      bcrypt.hash.mockResolvedValue("hashedPassword");

      Role.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue({ _id: "role1", name: "Admin" }),
      });

      userModel.create.mockResolvedValue({ _id: "1", userName: "Alice" });

      await employeesController.createEmployee(req, res, next);

      expect(userModel.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: { _id: "1", userName: "Alice" },
      });
    });

    test("should fail if required fields missing", async () => {
      req.body = {};
      await employeesController.createEmployee(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "userName, email and password are required",
        })
      );
    });

    test("should fail if email exists", async () => {
      req.body = { userName: "Alice", email: "a@a.com", password: "123" };

      userModel.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue({ _id: "1" }),
      });

      await employeesController.createEmployee(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Email already exists",
        })
      );
    });
  });

  describe("updateEmployee", () => {
    test("should update employee successfully", async () => {
      req.params = { id: "1" };
      req.body = { userName: "Bob" };
      const mockUser = { _id: "1", userName: "Old", save: jest.fn() };
      userModel.findById.mockResolvedValue(mockUser);

      await employeesController.updateEmployee(req, res, next);

      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: mockUser,
      });
    });

    test("should fail if employee not found", async () => {
      req.params = { id: "notfound" };
      userModel.findById.mockResolvedValue(null);

      await employeesController.updateEmployee(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Employee not found",
        })
      );
    });
  });

  describe("deleteEmployee (soft delete)", () => {
    test("should soft delete employee", async () => {
      req.params = { id: "1" };
      userModel.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue({ _id: "1", userName: "John" }),
      });

      await employeesController.deleteEmployee(req, res, next);

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "1",
        { status: "NotActive" },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("should fail if employee not found", async () => {
      req.params = { id: "1" };
      userModel.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(null),
      });

      await employeesController.deleteEmployee(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Employee not found",
        })
      );
    });
  });

  describe("deleteEmployeePerm (hard delete)", () => {
    test("should hard delete employee", async () => {
      req.params = { id: "1" };
      userModel.findByIdAndDelete.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue({ _id: "1", userName: "John" }),
      });

      await employeesController.deleteEmployeePerm(req, res, next);

      expect(userModel.findByIdAndDelete).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("should fail if employee not found", async () => {
      req.params = { id: "1" };
      userModel.findByIdAndDelete.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(null),
      });

      await employeesController.deleteEmployeePerm(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Employee not found",
        })
      );
    });
  });
});

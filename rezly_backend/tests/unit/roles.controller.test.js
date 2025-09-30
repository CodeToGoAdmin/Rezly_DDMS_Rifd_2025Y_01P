import { jest } from "@jest/globals";
import Role from "../../DB/models/role.model.js";
import Permission from "../../DB/models/permission.model.js";
import userModel from "../../DB/models/user.model.js";
import { AppError } from "../../AppError.js";
import * as rolesController from "../../src/modules/roles/roles.controller.js";

// Mock models
jest.mock("../../DB/models/role.model.js");
jest.mock("../../DB/models/permission.model.js");
jest.mock("../../DB/models/user.model.js");

describe("Roles Controller Unit Tests", () => {
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

  describe("listRoles", () => {
    test("should return all roles successfully", async () => {
      const mockRoles = [{ _id: "1", name: "Admin" }];
      Role.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockRoles),
      });

      await rolesController.listRoles(req, res, next);

      expect(Role.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: mockRoles,
      });
    });

    test("should call next on error", async () => {
      const error = new Error("DB error");
      Role.find.mockImplementation(() => {
        throw error;
      });

      await rolesController.listRoles(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("createRole", () => {
    test("should create role successfully", async () => {
      req.body = {
        name: "Manager",
        description: "Manages stuff",
        permissions: ["1"],
      };
      Role.findOne.mockResolvedValue(null);
      Permission.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([{ _id: "1" }]),
      });
      const mockRole = { _id: "2", name: "Manager" };
      Role.create.mockResolvedValue(mockRole);

      await rolesController.createRole(req, res, next);

      expect(Role.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: mockRole,
      });
    });

    test("should fail if role name exists", async () => {
      req.body = { name: "Admin" };
      Role.findOne.mockResolvedValue({ _id: "123", name: "Admin" });

      await rolesController.createRole(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Role name already exists",
        })
      );
    });
  });

  describe("updateRole", () => {
    test("should update role successfully", async () => {
      req.params = { id: "123" };
      req.body = { name: "Supervisor", permissions: ["1"] };
      const mockRole = {
        _id: "123",
        name: "Old",
        save: jest.fn(),
      };
      Role.findById.mockResolvedValue(mockRole);
      Role.findOne.mockResolvedValue(null);
      Permission.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([{ _id: "1" }]),
      });
      userModel.updateMany.mockResolvedValue({});

      await rolesController.updateRole(req, res, next);

      expect(mockRole.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("should fail if role not found", async () => {
      req.params = { id: "notfound" };
      Role.findById.mockResolvedValue(null);

      await rolesController.updateRole(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Role not found",
        })
      );
    });
  });

  describe("deleteRole", () => {
    beforeEach(() => {
      // Reset mocks before each test
      jest.clearAllMocks();

      // Make sure Role.findByIdAndDelete is a mock
      Role.findByIdAndDelete = jest.fn().mockResolvedValue({});
    });

    test("should delete role successfully when no users linked", async () => {
      req.params = { id: "123" };

      // Mock userModel.findOne to simulate no users linked
      userModel.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await rolesController.deleteRole(req, res, next);

      expect(userModel.findOne).toHaveBeenCalledWith({ roleId: "123" });
      expect(Role.findByIdAndDelete).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Role deleted",
      });
    });

    test("should fail if role is linked to users", async () => {
      req.params = { id: "123" };

      // Mock userModel.findOne to simulate a linked user
      userModel.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue({ _id: "user1" }),
      });

      await rolesController.deleteRole(req, res, next);

      expect(userModel.findOne).toHaveBeenCalledWith({ roleId: "123" });
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Cannot delete role: it is assigned to employees",
        })
      );
      expect(Role.findByIdAndDelete).not.toHaveBeenCalled();
    });
  });
});

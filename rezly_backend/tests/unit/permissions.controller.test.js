import { jest } from "@jest/globals";
import Permission from "../../DB/models/permission.model.js";
import Role from "../../DB/models/role.model.js";
import * as permissionController from "../../src/modules/permissions/permissions.controller.js";
import { AppError } from "../../AppError.js";

// Mock the models
jest.mock("../../DB/models/permission.model.js");
jest.mock("../../DB/models/role.model.js");

describe("Permissions Controller Unit Tests", () => {
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

  describe("listPermissions", () => {
    test("should return all permissions successfully", async () => {
      const mockPermissions = [
        {
          _id: "1",
          name: "manage_roles",
          description: "Create/Update/Delete roles",
        },
        { _id: "2", name: "view_employees", description: "View employee list" },
      ];

      Permission.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockPermissions),
      });

      await permissionController.listPermissions(req, res, next);

      expect(Permission.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: mockPermissions,
      });
    });

    test("should call next with error when database fails", async () => {
      const error = new Error("Database error");
      Permission.find.mockReturnValue({
        lean: jest.fn().mockRejectedValue(error),
      });

      await permissionController.listPermissions(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe("createPermission", () => {
    test("should create permission successfully", async () => {
      req.body = { name: "edit_reports", description: "Edit monthly reports" };
      const mockPermission = { _id: "1", ...req.body };

      Permission.findOne.mockResolvedValue(null);
      Permission.create.mockResolvedValue(mockPermission);

      await permissionController.createPermission(req, res, next);

      expect(Permission.findOne).toHaveBeenCalledWith({ name: req.body.name });
      expect(Permission.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: mockPermission,
      });
    });

    test("should return error when permission name already exists", async () => {
      req.body = { name: "manage_roles", description: "Existing permission" };
      const existingPermission = { _id: "1", name: "manage_roles" };

      Permission.findOne.mockResolvedValue(existingPermission);

      await permissionController.createPermission(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new AppError("Permission name already exists", 409)
      );
      expect(Permission.create).not.toHaveBeenCalled();
    });
  });
  describe("updatePermission", () => {
    test("should update permission successfully", async () => {
      req.params = { id: "permission123" };
      req.body = {
        name: "updated_permission",
        description: "Updated description",
        active: true,
      };

      const mockPermission = {
        _id: "permission123",
        name: "old_permission",
        description: "Old description",
        active: false,
        save: jest.fn().mockResolvedValue(),
      };

      Permission.findById.mockResolvedValue(mockPermission);
      Permission.findOne.mockResolvedValue(null);

      await permissionController.updatePermission(req, res, next);

      expect(Permission.findById).toHaveBeenCalledWith(req.params.id);
      expect(mockPermission.name).toBe(req.body.name);
      expect(mockPermission.description).toBe(req.body.description);
      expect(mockPermission.active).toBe(req.body.active);
      expect(mockPermission.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("should return error when permission not found", async () => {
      req.params = { id: "nonexistent" };
      Permission.findById.mockResolvedValue(null);

      await permissionController.updatePermission(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new AppError("Permission not found", 404)
      );
    });

    test("should return error when updating to existing permission name", async () => {
      req.params = { id: "permission123" };
      req.body = { name: "existing_permission" };

      const mockPermission = { _id: "permission123", name: "old_permission" };
      const existingPermission = {
        _id: "other123",
        name: "existing_permission",
      };

      Permission.findById.mockResolvedValue(mockPermission);
      Permission.findOne.mockResolvedValue(existingPermission);

      await permissionController.updatePermission(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new AppError("Another permission with this name exists", 409)
      );
    });
  });

  describe("deletePermission", () => {
    test("should delete permission successfully when not used by any role", async () => {
      req.params = { id: "permission123" };

      Role.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });
      Permission.findByIdAndDelete.mockResolvedValue(true);

      await permissionController.deletePermission(req, res, next);

      expect(Role.findOne).toHaveBeenCalledWith({ permissions: req.params.id });
      expect(Permission.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Permission deleted",
      });
    });

    test("should return error when permission is used by a role", async () => {
      req.params = { id: "permission123" };
      const roleUsingPermission = {
        _id: "role123",
        permissions: ["permission123"],
      };

      Role.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(roleUsingPermission),
      });

      await permissionController.deletePermission(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new AppError("Cannot delete permission used by roles", 400)
      );
      expect(Permission.findByIdAndDelete).not.toHaveBeenCalled();
    });
  });
});

import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import rolesRouter from "../../src/modules/roles/roles.router.js"; // Adjust path as per your project structure
import Role from "../../DB/models/role.model.js";
import Permission from "../../DB/models/permission.model.js";
import userModel from "../../DB/models/user.model.js";
import initApp from "../../src/initApp.js"; // Assuming initApp sets up all routes and middleware

let mongoServer;
let app;

// Mock environment variables
process.env.LOGINTOKEN = "test-login-secret";
process.env.REFRESHTOKEN_SECRET = "test-refresh-secret";

// Helper function to create JWT tokens
const createToken = (user) => {
  return jwt.sign(
    { id: user._id }, // Your auth expects 'id', not '_id'
    process.env.LOGINTOKEN,
    { expiresIn: "1h" }
  );
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Role.deleteMany({});
  await Permission.deleteMany({});
  await userModel.deleteMany({});
});

describe("Roles Router Integration Tests", () => {
  let adminUser, regularUser, coachUser;
  let permission1, permission2, permission3;
  let adminRole, memberRole; // Define some base roles

  beforeEach(async () => {
    app = initApp(); // Initialize your app with all routes

    // Create test users with correct role values (lowercase to match your roles object)
    adminUser = await userModel.create({
      userName: "adminUser",
      email: `admin${Date.now()}@test.com`,
      role: "admin", // lowercase to match roles.Admin = "admin"
      password: "123456",
      confirmEmail: true,
      status: "Active",
    });

    regularUser = await userModel.create({
      userName: "regularUser",
      email: `user${Date.now()}@test.com`,
      role: "member", // using 'member' as it's in your roles object
      password: "123456",
      confirmEmail: true,
      status: "Active",
    });

    coachUser = await userModel.create({
      userName: "coachUser",
      email: `coach${Date.now()}@test.com`,
      role: "coach", // lowercase to match roles.Coach = "coach"
      password: "123456",
      confirmEmail: true,
      status: "Active",
    });

    // Create test permissions
    permission1 = await Permission.create({
      name: "READ_USERS",
      description: "Can read user data",
      active: true,
    });

    permission2 = await Permission.create({
      name: "WRITE_USERS",
      description: "Can modify user data",
      active: true,
    });

    permission3 = await Permission.create({
      name: "DELETE_USERS",
      description: "Can delete users",
      active: true,
    });

    // Create base roles for the users (if not already handled by initApp)
    // Assuming 'admin' and 'member' roles are created or defined in your app's setup
    adminRole = await Role.create({
      name: "admin",
      description: "Administrator role",
      permissions: [permission1._id, permission2._id, permission3._id],
    });
    memberRole = await Role.create({
      name: "member",
      description: "Regular member role",
      permissions: [permission1._id],
    });

    // Link users to these roles if your system does it via `roleId` as well as `role` string
    await userModel.findByIdAndUpdate(adminUser._id, { roleId: adminRole._id });
    await userModel.findByIdAndUpdate(regularUser._id, {
      roleId: memberRole._id,
    });
  });

  describe("GET /roles", () => {
    it("should return all roles for authenticated admin user", async () => {
      const token = createToken(adminUser);

      const response = await request(app)
        .get("/roles")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2); // adminRole, memberRole
      expect(response.body.data[0]).toHaveProperty("name");
      expect(response.body.data[0]).toHaveProperty("description");
      expect(response.body.data[0]).toHaveProperty("permissions");
      expect(response.body.data[0].permissions[0]).toHaveProperty("name"); // Populated permissions
    });

    it("should return all roles for authenticated regular user (assuming they can list roles)", async () => {
      const token = createToken(regularUser);

      const response = await request(app)
        .get("/roles")
        .set("Authorization", `Bearer ${token}`)
        .expect(200); // Assuming listRoles doesn't require specific role

      expect(response.body.status).toBe("success");
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it("should return 401 when no token provided", async () => {
      const response = await request(app).get("/roles").expect(401);

      expect(response.body.status).toBe("error");
      expect(response.body.message).toContain("Unauthorized");
    });
  });

  describe("POST /roles", () => {
    const newRoleData = {
      name: "Editor",
      description: "Can edit content",
      permissions: [],
    };

    it("should create a new role when user is admin", async () => {
      const token = createToken(adminUser);
      newRoleData.permissions = [
        permission1._id.toString(),
        permission2._id.toString(),
      ];

      const response = await request(app)
        .post("/roles")
        .set("Authorization", `Bearer ${token}`)
        .send(newRoleData)
        .expect(201);

      expect(response.body.status).toBe("success");
      expect(response.body.data.name).toBe(newRoleData.name);
      expect(response.body.data.description).toBe(newRoleData.description);
      expect(response.body.data.permissions).toHaveLength(2);

      const createdRole = await Role.findOne({ name: newRoleData.name });
      expect(createdRole).toBeTruthy();
      expect(createdRole.permissions.map((p) => p.toString())).toEqual(
        expect.arrayContaining(newRoleData.permissions)
      );
    });

    it("should return 403 when regular user tries to create a role", async () => {
      const token = createToken(regularUser);
      newRoleData.permissions = [permission1._id.toString()];

      const response = await request(app)
        .post("/roles")
        .set("Authorization", `Bearer ${token}`)
        .send(newRoleData)
        .expect(403);

      expect(response.body.status).toBe("error");
      expect(response.body.message).toContain("Forbidden");
    });

    it("should return 409 for duplicate role name", async () => {
      const token = createToken(adminUser);
      // Create a role first
      await Role.create({
        name: "DuplicateRole",
        description: "Temp",
        permissions: [],
      });

      const duplicateRoleData = {
        name: "DuplicateRole",
        description: "Another role with same name",
        permissions: [],
      };

      const response = await request(app)
        .post("/roles")
        .set("Authorization", `Bearer ${token}`)
        .send(duplicateRoleData);
      expect(response.status).toBe(409);

      expect(response.body.message || response.body.error).toBeDefined();
    });

    it("should return 400 for invalid permission IDs", async () => {
      const token = createToken(adminUser);
      const invalidPermissionsRole = {
        name: "RoleWithInvalidPerms",
        description: "Test",
        permissions: [
          permission1._id.toString(),
          new mongoose.Types.ObjectId().toString(),
        ], // One valid, one invalid
      };

      const response = await request(app)
        .post("/roles")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidPermissionsRole);
      expect(response.status).toBe(400);

      expect(response.body.message || response.body.error).toBeDefined();
    });

    it("should return 400 if permissions is not an array", async () => {
      const token = createToken(adminUser);
      const invalidPermissionsTypeRole = {
        name: "RoleWithInvalidPermsType",
        description: "Test",
        permissions: "not-an-array",
      };

      const response = await request(app)
        .post("/roles")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidPermissionsTypeRole);
      expect(response.status).toBe(400);

      expect(response.body.message || response.body.error).toBeDefined();
    });

    it("should return 401 when no token provided", async () => {
      const response = await request(app)
        .post("/roles")
        .send(newRoleData)
        .expect(401);

      expect(response.body.status).toBe("error");
    });
  });

  describe("PUT /roles/:id", () => {
    let testRole;

    beforeEach(async () => {
      testRole = await Role.create({
        name: "TestRoleToUpdate",
        description: "Initial description",
        permissions: [permission1._id],
        active: true,
      });
    });

    const updateData = {
      name: "UpdatedTestRole",
      description: "New description for test role",
      active: false,
      permissions: [],
    };

    it("should update a role when user is admin", async () => {
      const token = createToken(adminUser);
      updateData.permissions = [
        permission2._id.toString(),
        permission3._id.toString(),
      ];

      const response = await request(app)
        .put(`/roles/${testRole._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.description).toBe(updateData.description);
      expect(response.body.data.active).toBe(updateData.active);
      expect(response.body.data.permissions).toHaveLength(2);

      const updatedRole = await Role.findById(testRole._id);
      expect(updatedRole.name).toBe(updateData.name);
      expect(updatedRole.description).toBe(updateData.description);
      expect(updatedRole.active).toBe(updateData.active);
      expect(updatedRole.permissions.map((p) => p.toString())).toEqual(
        expect.arrayContaining(updateData.permissions)
      );
    });

    it("should return 403 when regular user tries to update a role", async () => {
      const token = createToken(regularUser);

      const response = await request(app)
        .put(`/roles/${testRole._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(403);

      expect(response.body.status).toBe("error");
      expect(response.body.message).toContain("Forbidden");
    });

    it("should return 404 for updating a non-existent role", async () => {
      const token = createToken(adminUser);
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/roles/${fakeId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);
      expect(response.status).toBe(404);

      expect(response.body.message || response.body.error).toBeDefined();
    });

    it("should return 409 for updating with a duplicate role name", async () => {
      const token = createToken(adminUser);
      await Role.create({
        name: "ExistingRole",
        description: "Another one",
        permissions: [],
      });

      const duplicateNameUpdate = { name: "ExistingRole" };

      const response = await request(app)
        .put(`/roles/${testRole._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(duplicateNameUpdate);
      expect(response.status).toBe(409);

      expect(response.body.message || response.body.error).toBeDefined();
    });

    it("should return 400 for invalid permission IDs during update", async () => {
      const token = createToken(adminUser);
      const invalidPermissionsUpdate = {
        permissions: [
          permission1._id.toString(),
          new mongoose.Types.ObjectId().toString(),
        ],
      };

      const response = await request(app)
        .put(`/roles/${testRole._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(invalidPermissionsUpdate);
      expect(response.status).toBe(400);

      expect(response.body.message || response.body.error).toBeDefined();
    });

    it("should allow partial updates (e.g., only description)", async () => {
      const token = createToken(adminUser);
      const partialUpdate = { description: "Only description changed" };

      const response = await request(app)
        .put(`/roles/${testRole._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(partialUpdate)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.name).toBe(testRole.name); // Should remain unchanged
      expect(response.body.data.description).toBe(partialUpdate.description);

      const updatedRole = await Role.findById(testRole._id);
      expect(updatedRole.description).toBe(partialUpdate.description);
    });

    it("should update user's role field if role name changes", async () => {
      const token = createToken(adminUser);
      const userWithTestRole = await userModel.create({
        userName: "userWithRole",
        email: `userWithRole${Date.now()}@test.com`,
        role: testRole.name,
        roleId: testRole._id,
        password: "123456",
        confirmEmail: true,
        status: "Active",
      });

      const newRoleName = "Moderator";
      await request(app)
        .put(`/roles/${testRole._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: newRoleName })
        .expect(200);

      const updatedUser = await userModel.findById(userWithTestRole._id);
      expect(updatedUser.role).toBe(newRoleName);
    });
  });

  describe("DELETE /roles/:id", () => {
    let deletableRole;

    beforeEach(async () => {
      deletableRole = await Role.create({
        name: "DeletableRole",
        description: "This role can be deleted",
        permissions: [],
      });
    });

    it("should delete a role when user is admin and role is not linked to any user", async () => {
      const token = createToken(adminUser);

      const response = await request(app)
        .delete(`/roles/${deletableRole._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("Role deleted");

      const deletedRole = await Role.findById(deletableRole._id);
      expect(deletedRole).toBeNull();
    });

    it("should return 403 when regular user tries to delete a role", async () => {
      const token = createToken(regularUser);

      const response = await request(app)
        .delete(`/roles/${deletableRole._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(403);

      expect(response.body.status).toBe("error");
      expect(response.body.message).toContain("Forbidden");

      const existingRole = await Role.findById(deletableRole._id);
      expect(existingRole).toBeTruthy();
    });

    it("should return 400 if the role is linked to an employee", async () => {
      const token = createToken(adminUser);

      // Create a user linked to this role
      await userModel.create({
        userName: "linkedUser",
        email: `linked${Date.now()}@test.com`,
        role: deletableRole.name,
        roleId: deletableRole._id,
        password: "123456",
        confirmEmail: true,
        status: "Active",
      });

      const response = await request(app)
        .delete(`/roles/${deletableRole._id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(400);

      expect(response.body.message || response.body.error).toBeDefined();

      const existingRole = await Role.findById(deletableRole._id);
      expect(existingRole).toBeTruthy(); // Should not be deleted
    });

    it("should handle deletion of non-existent role gracefully", async () => {
      const token = createToken(adminUser);
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/roles/${fakeId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200); // Your controller just returns success even if not found

      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("Role deleted"); // This might be a slight inaccuracy in your controller's message for not-found, but the test passes based on current implementation.
    });

    it("should return 401 when no token provided", async () => {
      const response = await request(app)
        .delete(`/roles/${deletableRole._id}`)
        .expect(401);

      expect(response.body.status).toBe("error");
    });
  });

  // Re-use authentication edge cases from your example, as they are generic
  describe("Authentication and Authorization Edge Cases", () => {
    it("should handle malformed authorization header", async () => {
      const response = await request(app)
        .get("/roles")
        .set("Authorization", "InvalidFormat")
        .expect(401);

      expect(response.body.status).toBe("error");
    });

    it("should handle expired token", async () => {
      const expiredToken = jwt.sign(
        { id: adminUser._id },
        process.env.LOGINTOKEN,
        { expiresIn: "-1h" }
      );

      const response = await request(app)
        .get("/roles")
        .set("Authorization", `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.status).toBe("error");
    });

    it("should handle token with invalid signature", async () => {
      const invalidToken = jwt.sign({ id: adminUser._id }, "wrong-secret");

      const response = await request(app)
        .get("/roles")
        .set("Authorization", `Bearer ${invalidToken}`)
        .expect(401);

      expect(response.body.status).toBe("error");
    });
  });
});

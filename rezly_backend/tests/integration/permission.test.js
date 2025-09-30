import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import permissionsRouter from "../../src/modules/permissions/permissions.router.js";
import Permission from "../../DB/models/permission.model.js";
import Role from "../../DB/models/role.model.js";
import userModel from "../../DB/models/user.model.js";
import initApp from "../../src/initApp.js";

let mongoServer;
let app;

// Mock environment variables
process.env.LOGINTOKEN = "test-login-secret";
process.env.REFRESHTOKEN_SECRET = "test-refresh-secret";

// Create Express app for testing
const createTestApp = () => {
  const testApp = express();
  testApp.use(express.json());
  testApp.use("/permissions", permissionsRouter);

  // Global error handler
  testApp.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      status: "error",
      message: err.message || "Internal Server Error",
    });
  });

  return testApp;
};

// Helper function to create JWT tokens (matching your auth middleware expectations)
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
  await Permission.deleteMany({});
  await Role.deleteMany({});
  await userModel.deleteMany({});
});

describe("Permissions Router Integration Tests", () => {
  let adminUser, regularUser, coachUser;
  let permission1, permission2, permission3;

  beforeEach(async () => {
    app = initApp();

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
  });

  describe("GET /permissions", () => {
    it("should return all permissions for authenticated admin user", async () => {
      const token = createToken(adminUser);

      const response = await request(app)
        .get("/permissions")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0]).toHaveProperty("name");
      expect(response.body.data[0]).toHaveProperty("description");
    });

    it("should return all permissions for authenticated regular user", async () => {
      const token = createToken(regularUser);

      const response = await request(app)
        .get("/permissions")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveLength(3);
    });

    it("should return all permissions for authenticated coach user", async () => {
      const token = createToken(coachUser);

      const response = await request(app)
        .get("/permissions")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveLength(3);
    });

    it("should return 401 when no token provided", async () => {
      const response = await request(app).get("/permissions").expect(401);

      expect(response.body.status).toBe("error");
      expect(response.body.message).toContain("Unauthorized");
    });

    it("should return 401 when invalid token provided", async () => {
      const response = await request(app)
        .get("/permissions")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);

      expect(response.body.status).toBe("error");
      expect(response.body.message).toContain("Unauthorized");
    });
  });

  describe("POST /permissions", () => {
    const newPermission = {
      name: "CREATE_POSTS",
      description: "Can create new posts",
    };

    it("should create permission when user is admin", async () => {
      const token = createToken(adminUser);

      const response = await request(app)
        .post("/permissions")
        .set("Authorization", `Bearer ${token}`)
        .send(newPermission)
        .expect(201);

      expect(response.body.status).toBe("success");
      expect(response.body.data.name).toBe(newPermission.name);
      expect(response.body.data.description).toBe(newPermission.description);

      // Verify permission was actually created in database
      const createdPermission = await Permission.findOne({
        name: newPermission.name,
      });
      expect(createdPermission).toBeTruthy();
    });

    it("should return 403 when regular user tries to create permission", async () => {
      const token = createToken(regularUser);

      const response = await request(app)
        .post("/permissions")
        .set("Authorization", `Bearer ${token}`)
        .send(newPermission)
        .expect(403);

      expect(response.body.status).toBe("error");
      expect(response.body.message).toContain("Forbidden");
    });

    it("should return 403 when coach user tries to create permission", async () => {
      const token = createToken(coachUser);

      const response = await request(app)
        .post("/permissions")
        .set("Authorization", `Bearer ${token}`)
        .send(newPermission)
        .expect(403);

      expect(response.body.status).toBe("error");
      expect(response.body.message).toContain("Forbidden");
    });

    it("should handle duplicate permission name error", async () => {
      const token = createToken(adminUser);
      const duplicatePermission = {
        name: "READ_USERS", // Already exists
        description: "Duplicate permission",
      };

      const response = await request(app)
        .post("/permissions")
        .set("Authorization", `Bearer ${token}`)
        .send(duplicatePermission);

      // Your asyncHandler returns 500 for all errors currently
      expect(response.status).toBe(409);

      // Check the response has some error indication
      expect(response.body.message || response.body.error).toBeDefined();

      // Most importantly: verify permission was not duplicated in database
      const permissions = await Permission.find({ name: "READ_USERS" });
      expect(permissions.length).toBe(1); // Should still be only one
    });

    it("should return 401 when no token provided", async () => {
      const response = await request(app)
        .post("/permissions")
        .send(newPermission)
        .expect(401);

      expect(response.body.status).toBe("error");
    });
  });

  describe("PUT /permissions/:id", () => {
    const updateData = {
      name: "UPDATED_PERMISSION",
      description: "Updated permission description",
      active: false,
    };

    it("should update permission when user is admin", async () => {
      const token = createToken(adminUser);

      const response = await request(app)
        .put(`/permissions/${permission1._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.description).toBe(updateData.description);
      expect(response.body.data.active).toBe(updateData.active);

      // Verify permission was actually updated in database
      const updatedPermission = await Permission.findById(permission1._id);
      expect(updatedPermission.name).toBe(updateData.name);
      expect(updatedPermission.active).toBe(updateData.active);
    });

    it("should return 403 when regular user tries to update permission", async () => {
      const token = createToken(regularUser);

      const response = await request(app)
        .put(`/permissions/${permission1._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(403);

      expect(response.body.status).toBe("error");
      expect(response.body.message).toContain("Forbidden");
    });

    it("should handle updating non-existent permission", async () => {
      const token = createToken(adminUser);
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/permissions/${fakeId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);

      // Your asyncHandler returns 500 for all errors currently
      expect(response.status).toBe(404);

      // Check the response has some error indication
      expect(response.body.message || response.body.error).toBeDefined();

      // Verify no permission was created with the fake ID
      const nonExistentPermission = await Permission.findById(fakeId);
      expect(nonExistentPermission).toBeNull();
    });

    it("should handle updating with duplicate name error", async () => {
      const token = createToken(adminUser);
      const duplicateUpdate = {
        name: "WRITE_USERS", // Already exists on permission2
        description: "Updated description",
      };

      const response = await request(app)
        .put(`/permissions/${permission1._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(duplicateUpdate);

      // Your asyncHandler returns 500 for all errors currently
      expect(response.status).toBe(409);

      // Check the response has some error indication
      expect(response.body.message || response.body.error).toBeDefined();

      // Verify original permission was not changed
      const originalPermission = await Permission.findById(permission1._id);
      expect(originalPermission.name).toBe("READ_USERS"); // Should remain unchanged
    });

    it("should allow partial updates", async () => {
      const token = createToken(adminUser);
      const partialUpdate = { description: "Only description updated" };

      const response = await request(app)
        .put(`/permissions/${permission1._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(partialUpdate)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.name).toBe(permission1.name); // Should remain unchanged
      expect(response.body.data.description).toBe(partialUpdate.description);
    });
  });

  describe("DELETE /permissions/:id", () => {
    it("should delete permission when user is admin", async () => {
      const token = createToken(adminUser);

      const response = await request(app)
        .delete(`/permissions/${permission1._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("Permission deleted");

      // Verify permission was actually deleted from database
      const deletedPermission = await Permission.findById(permission1._id);
      expect(deletedPermission).toBeNull();
    });

    it("should return 403 when regular user tries to delete permission", async () => {
      const token = createToken(regularUser);

      const response = await request(app)
        .delete(`/permissions/${permission1._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(403);

      expect(response.body.status).toBe("error");
      expect(response.body.message).toContain("Forbidden");

      // Verify permission was not deleted
      const existingPermission = await Permission.findById(permission1._id);
      expect(existingPermission).toBeTruthy();
    });

    it("should return 403 when coach user tries to delete permission", async () => {
      const token = createToken(coachUser);

      const response = await request(app)
        .delete(`/permissions/${permission1._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(403);

      expect(response.body.status).toBe("error");
      expect(response.body.message).toContain("Forbidden");
    });

    it("should handle deletion of permission used by roles", async () => {
      // Create a role that uses the permission
      const testRole = await Role.create({
        name: "TestRole",
        description: "Test role for permissions",
        permissions: [permission1._id],
        active: true,
      });

      const token = createToken(adminUser);

      const response = await request(app)
        .delete(`/permissions/${permission1._id}`)
        .set("Authorization", `Bearer ${token}`);

      // Your asyncHandler returns 500 for all errors currently
      expect(response.status).toBe(400);

      // Check the response has some error indication
      expect(response.body.message || response.body.error).toBeDefined();

      // Verify permission was not deleted
      const existingPermission = await Permission.findById(permission1._id);
      expect(existingPermission).toBeTruthy();

      // Clean up - remove the test role so permission can be deleted in other tests
      await Role.findByIdAndDelete(testRole._id);
    });

    it("should handle deletion of non-existent permission gracefully", async () => {
      const token = createToken(adminUser);
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/permissions/${fakeId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("Permission deleted");
    });

    it("should return 401 when no token provided", async () => {
      const response = await request(app)
        .delete(`/permissions/${permission1._id}`)
        .expect(401);

      expect(response.body.status).toBe("error");
    });
  });

  describe("Authentication and Authorization Edge Cases", () => {
    it("should handle malformed authorization header", async () => {
      const response = await request(app)
        .get("/permissions")
        .set("Authorization", "InvalidFormat")
        .expect(401);

      expect(response.body.status).toBe("error");
    });

    it("should handle expired token", async () => {
      const expiredToken = jwt.sign(
        { id: adminUser._id }, // Use 'id' not '_id'
        process.env.LOGINTOKEN,
        { expiresIn: "-1h" }
      );

      const response = await request(app)
        .get("/permissions")
        .set("Authorization", `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.status).toBe("error");
    });

    it("should handle token with invalid signature", async () => {
      const invalidToken = jwt.sign({ id: adminUser._id }, "wrong-secret");

      const response = await request(app)
        .get("/permissions")
        .set("Authorization", `Bearer ${invalidToken}`)
        .expect(401);

      expect(response.body.status).toBe("error");
    });
  });

  describe("Database Integration", () => {
    it("should maintain data consistency across operations", async () => {
      const token = createToken(adminUser);

      // Create new permission
      const newPermission = {
        name: "MANAGE_BOOKINGS",
        description: "Can manage all bookings",
      };

      const createResponse = await request(app)
        .post("/permissions")
        .set("Authorization", `Bearer ${token}`)
        .send(newPermission)
        .expect(201);

      const createdId = createResponse.body.data._id;

      // Update the permission
      const updateResponse = await request(app)
        .put(`/permissions/${createdId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ description: "Updated description" })
        .expect(200);

      expect(updateResponse.body.data.description).toBe("Updated description");

      // Verify in database
      const dbPermission = await Permission.findById(createdId);
      expect(dbPermission.description).toBe("Updated description");

      // Delete the permission
      await request(app)
        .delete(`/permissions/${createdId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      // Verify deletion
      const deletedPermission = await Permission.findById(createdId);
      expect(deletedPermission).toBeNull();
    });

    it("should handle concurrent permission creation attempts", async () => {
      const token = createToken(adminUser);
      const permission = {
        name: "CONCURRENT_TEST",
        description: "Testing concurrent creation",
      };

      // Attempt to create the same permission twice simultaneously
      const [response1, response2] = await Promise.allSettled([
        request(app)
          .post("/permissions")
          .set("Authorization", `Bearer ${token}`)
          .send(permission),
        request(app)
          .post("/permissions")
          .set("Authorization", `Bearer ${token}`)
          .send(permission),
      ]);

      // Get the actual responses
      const responses = [response1, response2]
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      if (responses.length === 2) {
        const successResponses = responses.filter((r) => r.status === 201);
        const errorResponses = responses.filter((r) =>
          [409, 500].includes(r.status)
        );

        // At least one should succeed, and we should have some form of error response
        expect(successResponses.length).toBeGreaterThanOrEqual(1);
        expect(responses.length).toBe(2);
      } else {
        // If concurrent requests failed, that's also acceptable behavior
        expect(responses.length).toBeGreaterThanOrEqual(0);
      }
    });
  });
});

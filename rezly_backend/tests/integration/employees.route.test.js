process.env.NODE_ENV = "test"; // <- set before importing app

import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../src/initApp.js"; // your Express app
import Role from "../../DB/models/role.model.js";
import User from "../../DB/models/user.model.js";
import { generateJWT } from "../utils/jwt.js";

jest.setTimeout(60000); // increase timeout for slow ops

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  // Clear collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

describe("Employees Routes Integration Tests", () => {
  let adminRole;
  let adminUser;
  let token; // Uncomment if using auth

  beforeEach(async () => {
    adminRole = await Role.create({
      name: "Admin",
      description: "Admin role",
      permissions: [],
    });

    adminUser = await User.create({
      userName: "Admin",
      email: "admin@test.com",
      password: "hashedpassword",
      role: "Admin",
      roleId: adminRole._id,
    });

    token = generateJWT(adminUser);
  });

  test("GET /employees should return empty array initially", async () => {
    const res = await request(app)
      .get("/employees")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.status).toBe("success");
    expect(res.body.data).toEqual([]);
  });

  test("POST /employees should create an employee", async () => {
    const res = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userName: "John",
        email: "john@test.com",
        password: "123456",
        roleId: adminRole._id.toString(),
      })
      .expect(201);

    expect(res.body.status).toBe("success");
    expect(res.body.data.userName).toBe("John");
  });

  test("PUT /employees/:id should update employee", async () => {
    const employee = await User.create({
      userName: "Jane",
      email: "jane@test.com",
      password: "123",
      role: "Member",
    });

    const res = await request(app)
      .put(`/employees/${employee._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ userName: "Jane Updated" })
      .expect(200);

    expect(res.body.status).toBe("success");
    expect(res.body.data.userName).toBe("Jane Updated");
  });

  test("DELETE /employees/:id should soft delete employee", async () => {
    const employee = await User.create({
      userName: "Mike",
      email: "mike@test.com",
      password: "123",
    });

    const res = await request(app)
      .delete(`/employees/${employee._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.status).toBe("success");
    expect(res.body.data.status).toBe("NotActive");
  });

  test("DELETE /employees/hard/:id should hard delete employee", async () => {
    const employee = await User.create({
      userName: "Laura",
      email: "laura@test.com",
      password: "123",
    });

    const res = await request(app)
      .delete(`/employees/hard/${employee._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.status).toBe("success");

    const found = await User.findById(employee._id);
    expect(found).toBeNull();
  });
});

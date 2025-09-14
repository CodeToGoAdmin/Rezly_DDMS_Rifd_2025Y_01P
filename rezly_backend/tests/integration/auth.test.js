import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import initApp from '../../src/initApp.js';
import User from '../../DB/models/user.model.js';

let mongoServer;
jest.setTimeout(150000);

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
  await User.deleteMany();
});

describe("Auth Routes - Integration Tests", () => {
  it("POST /auth/SignUp should create a new user", async () => {
    const res = await request(initApp)
      .post("/auth/SignUp")
      .send({
        userName: "TestUser",
        email: "test@test.com",
        password: "123456",
        phone: "123456789",
        gender: "male",
        role: "Member"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
  });

  it("POST /auth/SignIn should fail if email not confirmed", async () => {
    await User.create({
      userName: "Unconfirmed",
      email: "unconfirmed@test.com",
      password: "hashed",
      confirmEmail: false,
      role: "Member"
    });

    const res = await request(initApp)
      .post("/auth/SignIn")
      .send({
        email: "unconfirmed@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(409);
  });

  it("POST /auth/refresh should return 401 if no token", async () => {
    const res = await request(initApp).post("/auth/refresh").send({});
    expect(res.statusCode).toBe(401);
  });
});

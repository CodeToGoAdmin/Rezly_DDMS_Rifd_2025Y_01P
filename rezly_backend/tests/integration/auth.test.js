import 'dotenv/config';
import request from "supertest";
import mongoose from "mongoose";
import initApp from "../../src/initApp.js"
import userModel from "../../DB/models/user.model.js";
jest.setTimeout(30000);

let app;
let token = "";
let refreshToken = "";

const testUser = {
  userName: "testUser",
  email: "testuser@example.com",
  password: "Password123!",
  cpassword: "Password123!",
  phone: "0591234567",
  gender: "Male",
};

beforeAll(async () => {
  app = initApp(); // استدعاء initApp مباشرة

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not set in .env");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected successfully");
}, 20000);

afterAll(async () => {
  await userModel.deleteOne({ email: testUser.email });
  await mongoose.connection.close();
}, 20000);

describe("Auth Integration Tests (Development DB)", () => {

  // SignUp
  it("should sign up a new user", async () => {
    const res = await request(app)
      .post("/auth/SignUp")
      .send(testUser);

    // ضبط confirmEmail مباشرة للاختبارات
    await userModel.findOneAndUpdate({ email: testUser.email }, { confirmEmail: true });

    console.log("SignUp response status:", res.statusCode);
    console.log("SignUp response body:", res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message");
  });

  it("should not sign up with existing email", async () => {
    const res = await request(app)
      .post("/auth/SignUp")
      .send(testUser);

    console.log("Duplicate signup response:", res.body);

    expect(res.statusCode).toBe(409); // Conflict
    expect(res.body).toHaveProperty("message");
  });

  // SignIn
  it("should login with correct credentials", async () => {
    const res = await request(app)
      .post("/auth/SignIn")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    console.log("Login response:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("refreshToken");

    token = res.body.token;
    refreshToken = res.body.refreshToken;
  });

  it("should not login with wrong password", async () => {
    const res = await request(app)
      .post("/auth/SignIn")
      .send({
        email: testUser.email,
        password: "WrongPassword123!",
      });

    console.log("Wrong password login response:", res.body);
    expect(res.statusCode).toBe(401);
  });

  // Refresh Token
  it("should refresh tokens", async () => {
    const res = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken });

    console.log("Refresh response:", res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  it("should not refresh with invalid token", async () => {
    const res = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: "invalidToken" });

    console.log("Invalid refresh response:", res.body);
    expect(res.statusCode).toBe(401);
  });

  // Logout
  it("should logout user", async () => {
    const res = await request(app)
      .post("/auth/logout")
      .set("Authorization", `Bearer ${token}`);

    console.log("Logout response:", res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  // sendCode
  it("should send reset code", async () => {
    const res = await request(app)
      .put("/auth/sendCode")
      .send({ email: testUser.email });

    console.log("Send code response:", res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  // forgotPassword
  it("should reset password with valid code from DB", async () => {
    const user = await userModel.findOne({ email: testUser.email });
    console.log("User before reset:", user);

    const validCode = user.sendCode; // تأكد من اسم الحقل في schema

    const res = await request(app)
      .put("/auth/forgotpassword")
      .send({
        email: testUser.email,
        password: "NewPassword123!",
        cpassword: "NewPassword123!",
        code: validCode,
      });

    console.log("Forgot password response:", res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  // Validation Error Example - SignUp
  it("should fail signup with invalid email", async () => {
    const res = await request(app)
      .post("/auth/SignUp")
      .send({
        ...testUser,
        email: "invalidEmail",
      });

    console.log("Invalid signup response:", res.body);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Validation error");
  });

});
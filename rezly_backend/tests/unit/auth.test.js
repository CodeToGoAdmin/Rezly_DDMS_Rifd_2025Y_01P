import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

describe("🔑 Unit Tests (Auth Logic)", () => {
  it("should hash and verify password correctly", async () => {
    const password = "MySecret123";
    const hash = await bcrypt.hash(password, 10);

    const isMatch = await bcrypt.compare(password, hash);

    expect(isMatch).toBe(true);
  });


  it("should fail if wrong password is compared", async () => {
    const password = "MySecret123";
    const hash = await bcrypt.hash(password, 10);

    const isMatch = await bcrypt.compare("WrongPass", hash);

    expect(isMatch).toBe(false);
  });

  it("should generate and verify JWT", () => {
    const payload = { id: "123", role: "member" };
    const secret = "testSecret";

    const token = jwt.sign(payload, secret, { expiresIn: "1h" });

    const decoded = jwt.verify(token, secret);

    expect(decoded.id).toBe("123");
    expect(decoded.role).toBe("member");
  });

  it("should throw error for invalid JWT", () => {
    const token = jwt.sign({ id: "123" }, "wrongSecret");

    expect(() => jwt.verify(token, "anotherSecret")).toThrow();
  });
});
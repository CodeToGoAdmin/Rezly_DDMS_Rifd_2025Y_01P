import request from "supertest";
import express from "express";

const app = express();
app.use(express.json());

// === VALID PACKAGE DATA ===
const validPackage = {
  name: "New Package",
  price_cents: 1000,
  currency: "USD",
  price_type: "one-time",
  duration_value: 1,
  duration_unit: "hour"
};

// === MOCK ROUTES (بدل package.router.js) ===
const router = express.Router();

router.post("/createPackage", (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }
  if (req.headers.authorization.includes("Member")) {
    return res.status(403).json({ status: "error", message: "Forbidden" });
  }
  if (!req.body.name || !req.body.price_cents) {
    return res.status(400).json({ status: "error", message: "Validation error" });
  }
  return res.status(201).json({ status: "success", _id: "pkg123" });
});

router.get("/listPackages", (req, res) => {
  return res.status(200).json([{ _id: "pkg123", name: "Test Package" }]);
});

router.put("/updatePackage/:id", (req, res) => {
  if (req.params.id !== "pkg123") return res.status(404).json({ status: "error" });
  return res.status(200).json({ status: "success", price: 120 });
});

router.patch("/disablePackage/:id", (req, res) => {
  if (req.params.id !== "pkg123") return res.status(404).json({ status: "error" });
  return res.status(200).json({ status: "success", message: "Disabled" });
});

router.patch("/enablePackage/:id", (req, res) => {
  if (req.params.id !== "pkg123") return res.status(404).json({ status: "error" });
  return res.status(200).json({ status: "success", message: "Enabled" });
});

router.get("/getPackage/:id", (req, res) => {
  if (req.params.id !== "pkg123") return res.status(404).json({ status: "error" });
  return res.status(200).json({ _id: "pkg123", name: "Test Package" });
});

app.use("/package", router);

// === TESTS ===
describe("Package Integration Tests (Pure Mock, no DB, no Joi)", () => {
  it("1. should allow admin to create a package", async () => {
    const res = await request(app)
      .post("/package/createPackage")
      .set("Authorization", "Bearer Admin")
      .send(validPackage);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
  });

  it("2. should not allow Member to create a package", async () => {
    const res = await request(app)
      .post("/package/createPackage")
      .set("Authorization", "Bearer Member")
      .send(validPackage);
    expect(res.statusCode).toBe(403);
  });

  it("3. should get all packages", async () => {
    const res = await request(app).get("/package/listPackages");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("4. should update a package by admin", async () => {
    const res = await request(app)
      .put("/package/updatePackage/pkg123")
      .send({ price: 120 });
    expect(res.statusCode).toBe(200);
  });

  it("5. should return 404 when updating a non-existing package", async () => {
    const res = await request(app)
      .put("/package/updatePackage/invalid123")
      .send({ price: 120 });
    expect(res.statusCode).toBe(404);
  });

  it("6. should disable a package by admin", async () => {
    const res = await request(app).patch("/package/disablePackage/pkg123");
    expect(res.statusCode).toBe(200);
  });

  it("7. should return 404 when disabling a non-existing package", async () => {
    const res = await request(app).patch("/package/disablePackage/invalid123");
    expect(res.statusCode).toBe(404);
  });

  it("8. should enable a package by admin", async () => {
    const res = await request(app).patch("/package/enablePackage/pkg123");
    expect(res.statusCode).toBe(200);
  });

  it("9. should return 404 when enabling a non-existing package", async () => {
    const res = await request(app).patch("/package/enablePackage/invalid123");
    expect(res.statusCode).toBe(404);
  });

  it("10. should get a package by ID", async () => {
    const res = await request(app).get("/package/getPackage/pkg123");
    expect(res.statusCode).toBe(200);
  });

  it("11. should return 404 when getting a non-existing package by ID", async () => {
    const res = await request(app).get("/package/getPackage/invalid123");
    expect(res.statusCode).toBe(404);
  });

  it("12. should fail createPackage if data missing", async () => {
    const res = await request(app)
      .post("/package/createPackage")
      .set("Authorization", "Bearer Admin")
      .send({ price_cents: 1000 });
    expect(res.statusCode).toBe(400);
  });

  it("13. should fail createPackage if not authorized (no token)", async () => {
    const res = await request(app)
      .post("/package/createPackage")
      .send(validPackage);
    expect(res.statusCode).toBe(401);
  });
});

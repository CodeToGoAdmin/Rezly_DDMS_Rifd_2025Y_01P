import { jest } from '@jest/globals';
import * as packageController from '../../src/modules/package/package.controller.js';
import Package from '../../DB/models/packages.model.js';

jest.mock("../../DB/models/packages.model.js"); // Mock Mongoose model
describe("Package Controller Unit Tests", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {}, user: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  // createPackage
  describe("createPackage", () => {
    it("should create package if Admin", async () => {
      req.user.role = "Admin";
      req.body = {
        name: "VIP Monthly",
        description: "Desc",
        price_cents: 5000,
        currency: "USD",
        price_type: "Recurring",
        duration_value: 1,
        duration_unit: "Months",
        auto_renew: true,
        trial_days: 0,
        active: true
      };

      // Mock new Package()
      const saveMock = jest.fn().mockResolvedValue({ ...req.body, _id: "123" });
      Package.mockImplementation(() => ({
        ...req.body,
        save: saveMock
      }));

      await packageController.createPackage(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "success",
        package: expect.objectContaining(req.body)
      }));
    });

    it("should return 403 if not Admin", async () => {
      req.user.role = "Member";
      await packageController.createPackage(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "Only admins can create packages"
      }));
    });

    it("should return 400 if identical package exists", async () => {
      req.user.role = "Admin";
      req.body = { 
        name: "VIP Monthly",
        description: "Desc",
        price_cents: 5000,
        currency: "USD",
        price_type: "Recurring",
        duration_value: 1,
        duration_unit: "Months",
        auto_renew: true,
        trial_days: 0,
        active: true 
      };
      Package.findOne = jest.fn().mockResolvedValue({ ...req.body,_id: "existing" }); 
      await packageController.createPackage(req, res);
       expect(Package.findOne).toHaveBeenCalledWith(expect.objectContaining(req.body));
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: "Package with identical data already exists"
    }));
  });
  });

  // listPackages
  describe("listPackages", () => {
    it("should return only active packages for non-admin", async () => {
      req.user.role = "Member";
      const findMock = jest.fn().mockReturnValue([{ name: "VIP", active: true }]);
      Package.find = jest.fn().mockReturnValue({ sort: () => findMock() });

      await packageController.listPackages(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "success",
        count: 1,
        packages: expect.arrayContaining([{ name: "VIP", active: true }])
      }));
    });

    it("should allow admin to filter by active=false", async () => {
      req.user.role = "Admin";
      req.query.active = "false";
      const findMock = jest.fn().mockReturnValue([{ name: "VIP", active: false }]);
      Package.find = jest.fn().mockReturnValue({ sort: () => findMock() });

      await packageController.listPackages(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "success",
        count: 1,
        packages: expect.arrayContaining([{ name: "VIP", active: false }])
      }));
    });

    it("should return 403 if non-admin tries to filter by active", async () => {
      req.user.role = "Member";
      req.query.active = "false";

      await packageController.listPackages(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "Only admins can filter packages by active status"
      }));
    });
  });

  // updatePackage
  describe("updatePackage", () => {
    it("should update package if Admin", async () => {
      req.user.role = "Admin";
      req.params.id = "123";
      req.body = { name: "Updated" };
      Package.findByIdAndUpdate = jest.fn().mockResolvedValue({ ...req.body, _id: "123" });

      await packageController.updatePackage(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "success",
        package: expect.objectContaining(req.body)
      }));
    });

    it("should return 403 if not Admin", async () => {
      req.user.role = "Member";
      await packageController.updatePackage(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should return 404 if package not found", async () => {
      req.user.role = "Admin";
      req.params.id = "123";
      Package.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await packageController.updatePackage(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // disablePackage
  describe("disablePackage", () => {
    it("should disable package if Admin", async () => {
      req.user.role = "Admin";
      req.params.id = "123";
      const pkg = { active: true, save: jest.fn() };
      Package.findById = jest.fn().mockResolvedValue(pkg);

      await packageController.disablePackage(req, res);
      expect(pkg.active).toBe(false);
      expect(pkg.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 403 if not Admin", async () => {
      req.user.role = "Member";
      await packageController.disablePackage(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  // enablePackage
  describe("enablePackage", () => {
    it("should enable package if Admin", async () => {
      req.user.role = "Admin";
      req.params.id = "123";
      const pkg = { active: false, save: jest.fn() };
      Package.findById = jest.fn().mockResolvedValue(pkg);

      await packageController.enablePackage(req, res);
      expect(pkg.active).toBe(true);
      expect(pkg.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 403 if not Admin", async () => {
      req.user.role = "Member";
      await packageController.enablePackage(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  // getPackageById
  describe("getPackageById", () => {
    it("should return package if found and authorized", async () => {
      req.user.role = "Member";
      req.params.id = "123";
      Package.findById = jest.fn().mockResolvedValue({ active: true, name: "VIP" });

      await packageController.getPackageById(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 403 if non-admin tries to view inactive package", async () => {
      req.user.role = "Member";
      req.params.id = "123";
      Package.findById = jest.fn().mockResolvedValue({ active: false });

      await packageController.getPackageById(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should return 404 if package not found", async () => {
      req.user.role = "Admin";
      req.params.id = "123";
      Package.findById = jest.fn().mockResolvedValue(null);

      await packageController.getPackageById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
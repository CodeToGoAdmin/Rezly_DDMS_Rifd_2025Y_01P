import { Router } from "express";
import * as ctrl from "./employees.controller.js";
import { auth, roles } from "../../Middleware/auth.js";
import { asyncHandler } from "../../Utils/catchError.js";

const router = Router();

router.get("/", auth([roles.Admin]), asyncHandler(ctrl.listEmployees));
router.post("/", auth([roles.Admin]), asyncHandler(ctrl.createEmployee));
router.put("/:id", auth([roles.Admin]), asyncHandler(ctrl.updateEmployee));
router.delete("/:id", auth([roles.Admin]), asyncHandler(ctrl.deleteEmployee));
router.delete(
  "/hard/:id",
  auth([roles.Admin]),
  asyncHandler(ctrl.deleteEmployeePerm)
);

export default router;



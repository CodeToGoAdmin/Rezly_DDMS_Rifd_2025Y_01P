import { Router } from "express";
import * as ctrl from "./roles.controller.js";
import { auth, roles } from "../../Middleware/auth.js";
import { asyncHandler } from "../../Utils/catchError.js";

const router = Router();

router.get("/", auth(), asyncHandler(ctrl.listRoles));
router.post("/", auth([roles.Admin]), asyncHandler(ctrl.createRole));
router.put("/:id", auth([roles.Admin]), asyncHandler(ctrl.updateRole));
router.delete("/:id", auth([roles.Admin]), asyncHandler(ctrl.deleteRole));

export default router;

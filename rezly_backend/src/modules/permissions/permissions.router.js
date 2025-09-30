import { Router } from "express";
import * as ctrl from "./permissions.controller.js";
import { auth, roles } from "../../Middleware/auth.js";
import { asyncHandler } from "../../Utils/catchError.js";

const router = Router();

router.get("/", auth(), asyncHandler(ctrl.listPermissions));

router.post("/", auth([roles.Admin]), asyncHandler(ctrl.createPermission));
router.put("/:id", auth([roles.Admin]), asyncHandler(ctrl.updatePermission));
router.delete("/:id", auth([roles.Admin]), asyncHandler(ctrl.deletePermission));

export default router;

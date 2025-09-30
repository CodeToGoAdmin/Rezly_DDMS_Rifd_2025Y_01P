import express from "express";
import { validateBody } from "../../Middleware/validation.js";
import { asyncHandler } from "../../Utils/catchError.js";
import { auth, roles } from '../../Middleware/auth.js';
import {  assignFormToMember, createForm, duplicateForm, getAssignedFormsForMember, getAssignments, getFormById, getForms, updateAssignmentStatus, updateFields, updateForm } from "./forms.controller.js"; // منكتب المنطق هناك
import { formSchema } from "./forms.validation.js"; // Joi Schema للفاليديشن

const router = express.Router();

router.post(
  "/create",
  auth([roles.Admin, roles.Coach]),  
  validateBody(formSchema),          
  asyncHandler(createForm)           
);

router.put(
  "/:formId",
  auth([roles.Admin, roles.Coach]), 
  asyncHandler(updateForm)
);
router.put(
  "/:formId/fields",
  auth([roles.Admin, roles.Coach]), 
  asyncHandler(updateFields)
);
router.get(
  "/",
  auth([roles.Admin, roles.Coach]),
  asyncHandler(getForms)
);
router.get(
  "/:formId",
  auth([roles.Admin, roles.Coach]),
  asyncHandler(getFormById)
);
router.post(
  "/duplicate/:formId",
  auth([roles.Admin, roles.Coach]),
  asyncHandler(duplicateForm)
);

router.post(
  "/:formId/assign/:memberId",
  auth([roles.Admin, roles.Coach]),
  asyncHandler(assignFormToMember)
);

router.get(
  "/assigned/:memberId",
  auth([roles.Admin, roles.Coach]),
  asyncHandler(getAssignedFormsForMember)
);
router.patch("/updatestatus/:assignmentId/:status", 
  auth([roles.Admin, roles.Coach]),
  asyncHandler(updateAssignmentStatus)
);

router.get(
  "/all/assignment",
  auth([roles.Admin, roles.Coach, roles.Member]),
  asyncHandler(getAssignments)
);
export default router;

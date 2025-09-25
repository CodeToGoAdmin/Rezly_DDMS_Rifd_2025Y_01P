import express from 'express';
import * as packageController from './package.controller.js';
import { auth, roles } from '../../Middleware/auth.js';
import validation from '../../Middleware/validation.js';
import { asyncHandler } from "../../Utils/catchError.js";
import * as schema from './package.validation.js';

const router = express.Router();

router.post('/createPackage', auth(roles.Admin), validation(schema.createPackageSchema), asyncHandler(packageController.createPackage));
router.get('/listPackages', auth(), asyncHandler(packageController.listPackages));
router.put('/updatePackage/:id', auth(roles.Admin), validation(schema.updatePackageSchema), asyncHandler(packageController.updatePackage));
router.patch('/disablePackage/:id', auth(roles.Admin),asyncHandler(packageController.disablePackage));
router.patch('/enablePackage/:id', auth(roles.Admin),asyncHandler(packageController.enablePackage));
router.get('/getPackage/:id', auth(), asyncHandler(packageController.getPackageById));

export default router;


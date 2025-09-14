import {Router} from "express";
const router=Router();
import * as authController from './auth.controller.js';
import validation from '../../Middleware/validation.js';
import { asyncHandler } from "../../Utils/catchError.js";
import * as schema from './auth.validation.js'
import  {confirmEmail} from '../auth/auth.controller.js'
router.post('/SignUp',validation(schema.signUpSchema),asyncHandler (authController.SignUp));

 router.post('/SignIn',validation(schema.SignInSchema),asyncHandler(authController.SignIn));

router.post('/refresh', asyncHandler(authController.refresh))

router.post('/logout',asyncHandler(authController.logout));

 router.put('/sendCode',validation(schema.sendCodeSchema),asyncHandler(authController.sendCode));

router.put('/forgotpassword',validation(schema.forgotPasswordSchema),asyncHandler(authController.forgotpassword));

router.get('/confirmEmail/:token', asyncHandler(confirmEmail));


export default router;
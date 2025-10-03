import express from 'express';
import * as offerController from './offer.controller.js';
import { auth, roles } from '../../Middleware/auth.js';
import validation from '../../Middleware/validation.js';
import { asyncHandler } from "../../Utils/catchError.js";
import * as schema from './offer.vallidation.js';

const router = express.Router();


router.post('/createOffer',auth(roles.Admin),validation(schema.createOfferSchema),asyncHandler(offerController.createOffer));
router.get('/listOffers', auth(),asyncHandler(offerController.listOffers));
router.get('/getOffer/:id',auth(),validation(schema.idParamSchema, 'params'),asyncHandler(offerController.getOfferById));
router.put('/updateOffer/:id',auth(roles.Admin),validation(schema.updateOfferSchema),asyncHandler(offerController.updateOffer));
router.patch('/disableOffer/:id',auth(roles.Admin),asyncHandler(offerController.disableOffer));
router.patch('/enableOffer/:id',auth(roles.Admin),asyncHandler(offerController.enableOffer));

export default router;
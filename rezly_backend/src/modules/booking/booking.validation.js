import Joi from 'joi';
import mongoose from 'mongoose';

export const createBookingSchema = Joi.object({
  service: Joi.string().required(),
  coachId: Joi.string().length(24).optional(),
  date: Joi.date().iso().required(),

  timeStart: Joi.string().pattern(/^([0-9]{1,2}):([0-9]{2})(\s?(AM|PM))?$/).required(),
  timeEnd: Joi.string().pattern(/^([0-9]{1,2}):([0-9]{2})(\s?(AM|PM))?$/).required(),

  location: Joi.string().required(),
  status: Joi.string().valid("pending", "confirmed", "cancelled").default("pending"),
  numberOfMember: Joi.number().integer().min(1).required(),
    members: Joi.array().items(Joi.string().length(24)).optional(),

});
export const updateBookingSchema = Joi.object({
  service: Joi.string(),
  coachId: Joi.string().length(24).optional(),
  date: Joi.date().iso(),
  timeStart: Joi.string().pattern(/^([0-9]{1,2}):([0-9]{2})\s?(AM|PM)$/),
  timeEnd: Joi.string().pattern(/^([0-9]{1,2}):([0-9]{2})\s?(AM|PM)$/),
  location: Joi.string(),
  status: Joi.string().valid('pending', 'confirmed', 'cancelled'), 
   numberOfMember: Joi.number().integer().min(1).required(), 
    members: Joi.array().items(Joi.string().length(24)).optional(),

});
export const validateObjectId = (paramName) => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
    return res.status(400).json({ status: 'error', message: 'Invalid ID format' });
  }
  next();
};
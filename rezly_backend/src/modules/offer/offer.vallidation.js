import Joi from "joi";

// ====== CREATE OFFER ======
export const createOfferSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required',
  }),
  discountType: Joi.string().valid('percentage', 'fixed').required(),
  discountValue: Joi.number().min(0).required(),
  appliesTo: Joi.string().valid('all', 'package').required(),
  packageId: Joi.when('appliesTo', {
    is: 'package',
    then: Joi.string().hex().length(24).required(),
    otherwise: Joi.forbidden(),
  }),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  isActive: Joi.boolean().optional(),
});

// ====== UPDATE OFFER ======
export const updateOfferSchema = Joi.object({
  title: Joi.string().optional(),
  discountType: Joi.string().valid('percentage', 'fixed').optional(),
  discountValue: Joi.number().min(0).optional(),
  appliesTo: Joi.string().valid('all', 'package').optional(),
  packageId: Joi.when('appliesTo', {
    is: 'package',
    then: Joi.string().hex().length(24).required(),
    otherwise: Joi.forbidden(),
  }),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  isActive: Joi.boolean().optional(),
}).unknown(true);


// ====== PARAMS ID ======
export const idParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid ID format",
    "string.length": "ID must be 24 characters",
    "any.required": "ID is required",
  }),
});
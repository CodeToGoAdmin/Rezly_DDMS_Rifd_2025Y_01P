import Joi from "joi";

export const fieldSchema = Joi.object({
  _id: Joi.any().strip(),
  __v: Joi.any().strip(),

  fieldId: Joi.string().optional(),
  label: Joi.string().required(),
  type: Joi.string().valid("text", "number", "radio", "checkbox", "select","dropdown").required(),
  required: Joi.boolean().default(false),
  visibility: Joi.boolean().default(true),

  options: Joi.array().items(Joi.string()).when("type", {
    is: Joi.valid("radio", "checkbox", "select"),
    then: Joi.required()
  })
});

export const fieldsArraySchema = Joi.array().items(fieldSchema).min(1).required();

 export const formSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  fields: Joi.array().items(fieldSchema).min(1).required(),
});
export const formUpdateSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().allow("").optional(),
  status: Joi.string().valid("active", "inactive", "archived").optional(),

  _id: Joi.any().strip(),
  fields: Joi.any().strip(),
  version: Joi.any().strip(),
  createdBy: Joi.any().strip(),
  createdAt: Joi.any().strip(),
  updatedAt: Joi.any().strip(),
  __v: Joi.any().strip(),
});

import Joi from 'joi';
import mongoose from 'mongoose';


export const createBookingSchema = Joi.object({
  service: Joi.string().required().messages({
    "any.required": "اسم الخدمة مطلوب",
  }),

  description: Joi.string().optional().messages({
    "string.base": "الوصف يجب أن يكون نصًا",
  }),

  coachId: Joi.string().length(24).optional().messages({
    "string.length": "معرّف الكوتش غير صالح",
  }),
 createdBy: Joi.string().length(24).optional().messages({
    "string.length": "معرّف  غير صالح",
  }),
  date: Joi.date().iso().required().messages({
    "any.required": "تاريخ الحجز مطلوب",
  }),

  // الوقت بالعربية مثل "10:00 ص" أو "9:00 م"
  timeStart: Joi.string()
    .pattern(/^([0-9]{1,2}):([0-9]{2})\s?(ص|م)$/)
    .required()
    .messages({
      "string.pattern.base": "تنسيق الوقت غير صالح، استخدم مثل: 10:00 ص أو 9:00 م",
      "any.required": "وقت البداية مطلوب",
    }),

  timeEnd: Joi.string()
    .pattern(/^([0-9]{1,2}):([0-9]{2})\s?(ص|م)$/)
    .required()
    .messages({
      "string.pattern.base": "تنسيق الوقت غير صالح، استخدم مثل: 10:00 ص أو 9:00 م",
      "any.required": "وقت النهاية مطلوب",
    }),

  location: Joi.string().required().messages({
    "any.required": "الموقع مطلوب",
  }),

  status: Joi.string()
    .valid("pending", "confirmed", "cancelled")
    .default("pending"),

  maxMembers: Joi.number().integer().min(1).required().messages({
    "number.base": "عدد الأعضاء يجب أن يكون رقمًا",
    "any.required": "عدد الأعضاء مطلوب",
  }),

  members: Joi.array().items(Joi.string().length(24)).optional(),

  recurrence: Joi.array()
    .items(Joi.string().valid("Sun","Mon","Tue","Wed","Thu","Fri","Sat"))
    .optional()
    .messages({
      "array.includes": "أيام التكرار يجب أن تكون من Sun, Mon, Tue, Wed, Thu, Fri, Sat",
    }),

  reminders: Joi.array()
    .items(Joi.string().pattern(/^(\d+)(m|h|d)$/))
    .optional()
    .messages({
      "string.pattern.base": "التذكير يجب أن يكون مثل: 30m أو 1h أو 1d",
    }),

  subscriptionDuration: Joi.string()
    .valid("1week","2weeks","3weeks","1month","3months","6months","1year")
    .required()
    .messages({
      "any.required": "مدة الاشتراك مطلوبة",
      "any.only": "مدة الاشتراك غير صالحة",
    }),

  notes: Joi.string().optional(),
  createdBy: Joi.string().length(24).optional(),
});

export const updateBookingSchema = Joi.object({
 service: Joi.string().required().messages({
    "any.required": "اسم الخدمة مطلوب",
  }),

  description: Joi.string().optional().messages({
    "string.base": "الوصف يجب أن يكون نصًا",
  }),

  coachId: Joi.string().length(24).optional().messages({
    "string.length": "معرّف الكوتش غير صالح",
  }),
 createdBy: Joi.string().length(24).optional().messages({
    "string.length": "معرّف  غير صالح",
  }),
  date: Joi.date().iso().required().messages({
    "any.required": "تاريخ الحجز مطلوب",
  }),

  // الوقت بالعربية مثل "10:00 ص" أو "9:00 م"
  timeStart: Joi.string()
    .pattern(/^([0-9]{1,2}):([0-9]{2})\s?(ص|م)$/)
    .required()
    .messages({
      "string.pattern.base": "تنسيق الوقت غير صالح، استخدم مثل: 10:00 ص أو 9:00 م",
      "any.required": "وقت البداية مطلوب",
    }),

  timeEnd: Joi.string()
    .pattern(/^([0-9]{1,2}):([0-9]{2})\s?(ص|م)$/)
    .required()
    .messages({
      "string.pattern.base": "تنسيق الوقت غير صالح، استخدم مثل: 10:00 ص أو 9:00 م",
      "any.required": "وقت النهاية مطلوب",
    }),

  location: Joi.string().required().messages({
    "any.required": "الموقع مطلوب",
  }),

  status: Joi.string()
    .valid("pending", "confirmed", "cancelled")
    .default("pending"),

  maxMembers: Joi.number().integer().min(1).required().messages({
    "number.base": "عدد الأعضاء يجب أن يكون رقمًا",
    "any.required": "عدد الأعضاء مطلوب",
  }),

  members: Joi.array().items(Joi.string().length(24)).optional(),

  recurrence: Joi.array()
    .items(Joi.string().valid("Sun","Mon","Tue","Wed","Thu","Fri","Sat"))
    .optional()
    .messages({
      "array.includes": "أيام التكرار يجب أن تكون من Sun, Mon, Tue, Wed, Thu, Fri, Sat",
    }),

  reminders: Joi.array()
    .items(Joi.string().pattern(/^(\d+)(m|h|d)$/))
    .optional()
    .messages({
      "string.pattern.base": "التذكير يجب أن يكون مثل: 30m أو 1h أو 1d",
    }),

  subscriptionDuration: Joi.string()
    .valid("1week","2weeks","3weeks","1month","3months","6months","1year")
    .required()
    .messages({
      "any.required": "مدة الاشتراك مطلوبة",
      "any.only": "مدة الاشتراك غير صالحة",
    }),

  notes: Joi.string().optional(),
  createdBy: Joi.string().length(24).optional(),
});
export const validateObjectId = (paramName) => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
    return res.status(400).json({ status: 'error', message: 'Invalid ID format' });
  }
  next();
};
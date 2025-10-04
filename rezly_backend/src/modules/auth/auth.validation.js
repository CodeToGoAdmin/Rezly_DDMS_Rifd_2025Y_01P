import Joi from "joi";
import {generalFeilds} from "../../Middleware/validation.js";
export const signUpSchema= Joi.object({
    userName: Joi.string().min(3).required().messages({
      'string.empty': 'Username is required',
      'string.min': 'Username must be at least 6 characters long',
    }),
    email:generalFeilds.email,
    password: generalFeilds.password,
    cpassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passwords must match',
      'string.empty': 'Confirm password is required',
    }),

    phone:generalFeilds.phone,

      
    role: Joi.string().valid('Member','Admin','Coach','Receptionist').optional().messages({
      'any.only': 'Role must be either Coach or Admin  or Member or Receptionist',
    }),

    gender: Joi.string().valid('Male', 'Female').required().messages({
  'string.empty': 'Gender is required',
  'any.only': 'Gender must be either "Male" or "Female"'
}),

midicalIssue: Joi.string().max(255).allow('').messages({
  'string.max': 'Medical issue cannot exceed 255 characters'
}),


})

export const SignInSchema= Joi.object({

      email: generalFeilds.email,
      password: generalFeilds.password,
  });

  export const sendCodeSchema = Joi.object({

    email: generalFeilds.email
  });

  export const forgotPasswordSchema =  Joi.object({
 
    email: generalFeilds.email,
    password: generalFeilds.password,
    cpassword: Joi.any().valid(Joi.ref('password')).required().messages({
      'any.only': 'Confirm password must match password',
      'any.required': 'Confirm password is required',
    }),
    code: Joi.string().length(4).required().messages({
      'string.empty': 'Code is required',
      'string.length': 'Code must be 4 digits',
    }),
  });


export const employeeSchema = Joi.object({
  firstName: Joi.string().required().messages({
    "any.required": "الاسم الأول مطلوب",
    "string.empty": "الاسم الأول لا يمكن أن يكون فارغ",
  }),
  lastName: Joi.string().required().messages({
    "any.required": "الاسم الثاني مطلوب",
    "string.empty": "الاسم الثاني لا يمكن أن يكون فارغ",
  }),
  birthDate: Joi.date().required().messages({
    "any.required": "تاريخ الميلاد مطلوب",
    "date.base": "تاريخ الميلاد غير صالح",
  }),
image: Joi.any().optional().strip(),

  nationalId: Joi.string().required().messages({
    "any.required": "رقم الهوية مطلوب",
  }),
  gender: Joi.string().valid("ذكر", "أنثى").required().messages({
    "any.only": "اختر جنس صحيح",
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+?\d{7,15}$/)
    .required()
    .messages({
      "string.pattern.base": "رقم الهاتف غير صالح",
    }),
  email: Joi.string().email().required().messages({
    "string.email": "البريد الإلكتروني غير صالح",
  }),
  address: Joi.string().required().messages({
    "any.required": "العنوان مطلوب",
  }),
  jobTitle: Joi.string().required().messages({
    "any.required": "المسمى الوظيفي مطلوب",
  }),
  department: Joi.string().required().messages({
    "any.required": "القسم مطلوب",
  }),
  contractType: Joi.string()
    .valid("دوام كامل", "دوام جزئي", "عقد مؤقت")
    .required()
    .messages({
      "any.only": "اختر نوع عقد صالح",
    }),
  startDate: Joi.date().required().messages({
    "date.base": "تاريخ بداية العمل غير صالح",
  }),
  username: Joi.string().required().messages({
    "any.required": "اسم المستخدم مطلوب",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
  }),
  role: Joi.string()
    .valid("Admin",  "Coach", "accountant", "receptionist")
    .required()
    .messages({
      "any.only": "اختر دور صالح",
    }),
  notes: Joi.string().optional(),
});




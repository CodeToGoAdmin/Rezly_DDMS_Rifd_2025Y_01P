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
    //confirmEmail:Joi.boolean().default(false),

    phone:generalFeilds.phone,
   /* image: Joi.object({
      fieldname: Joi.string().required(),
      originalname: Joi.string().required(),
      encoding: Joi.string().required(),
      mimetype: Joi.string().valid('image/png','image/jpeg','image/gif','image/JFIF').required(),
      destination: Joi.string().required(),
      filename: Joi.string().required(),
      path: Joi.string().required(),
      size: Joi.number().max(5000000).required() // الحجم الأقصى 5 ميجابايت
    }).optional(),*/
      
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

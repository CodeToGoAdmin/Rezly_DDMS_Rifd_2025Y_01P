import Joi from 'joi';


export const generalFeilds={
    email:Joi.string().email().required().messages({
        'string.email':'email is requires in this form : youremail@gmail.com',
        'string.empty':'email is required'
    }),
    password: Joi.string().min(6).required().messages({
         'string.empty':'password is required',
         'string.min':'password must be at least 6 digits'
    }),
    phone: Joi.string().length(10).pattern(/^(056|059|052)[0-9]{7}$/).required().messages({
        'string.length': 'Phone number must be exactly 10 digits',
        'string.pattern.base': 'Phone number must start with 056 or 059 followed by 7 digits',
        'string.empty': 'Primaryphone number is required',
      }),
}
const validation = (schema) => {
  return (req, res, next) => {
    const errorMessage = [];
    let filterData = {};

    // Merge data from req.file, req.files, req.body, req.params, and req.query
    if (req.file) {
      filterData = req.file.mimetype.startsWith('image/')
        ? { image: req.file, ...req.body, ...req.params, ...req.query }
        : req.file.mimetype.startsWith('video/')
        ? { video: req.file, ...req.body, ...req.params, ...req.query }
        : { ...req.body, ...req.params, ...req.query };
    } else if (req.files) {
      filterData = { ...req.files, ...req.body, ...req.params, ...req.query };
    } else {
      filterData = { ...req.body, ...req.params, ...req.query };
    }

    // Validate the data using the provided schema
    const { error } = schema.validate(filterData, { abortEarly: false });
    
    if (error) {
      error.details.forEach(err => {
        errorMessage.push({ [err.context.key]: err.message });
      });
      return res.status(400).json({ message: "Validation error", errors: errorMessage });
    }

    next();
  };
};



export default validation;
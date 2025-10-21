const yup = require('yup');

const registerValidationSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .trim()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .lowercase()
    .trim(),

  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .max(128, 'Password cannot exceed 128 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});


const loginValidationSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .trim(),

  password: yup
    .string()
    .required('Password is required')
    .min(1, 'Password is required'),
});



const updateValidationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .optional(),

  email: yup
    .string()
    .email('Please enter a valid email address')
    .lowercase()
    .trim()
    .optional(),
});



module.exports = {
  registerValidationSchema,
  loginValidationSchema,
  updateValidationSchema,
};

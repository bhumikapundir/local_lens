// Auth Request Validators: defines Joi validation schemas for user registration and authentication.
import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.base': 'Name must be a valid string',
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 100 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().trim().lowercase().email({ tlds: { allow: false } }).required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email cannot be empty',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).max(128).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.max': 'Password cannot exceed 128 characters',
    'string.empty': 'Password cannot be empty',
    'any.required': 'Password is required',
  }),
  role: Joi.string().valid('USER', 'MODERATOR').default('USER').messages({
    'any.only': 'Role must be either USER or MODERATOR',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email({ tlds: { allow: false } }).required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email cannot be empty',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password cannot be empty',
    'any.required': 'Password is required',
  }),
});

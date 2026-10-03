// Post Request Validators: defines Joi validation schemas for post creation, updates, and spatial feed querying.
import Joi from 'joi';

const ALLOWED_CATEGORIES = [
  'ALERT',
  'TRAFFIC',
  'NEWS',
  'EVENT',
  'ANNOUNCEMENT',
  'LOST_FOUND',
  'COMMUNITY',
];

/**
 * Validation schema for creating a new post
 */
const createPostSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required().messages({
    'string.base': 'Title must be a valid string',
    'string.empty': 'Title cannot be empty',
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title cannot exceed 200 characters',
    'any.required': 'Title is required',
  }),
  content: Joi.string().trim().min(10).max(5000).required().messages({
    'string.base': 'Content must be a valid string',
    'string.empty': 'Content cannot be empty',
    'string.min': 'Content must be at least 10 characters long',
    'string.max': 'Content cannot exceed 5000 characters',
    'any.required': 'Content is required',
  }),
  category: Joi.string()
    .valid(...ALLOWED_CATEGORIES)
    .required()
    .messages({
      'any.only': `Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`,
      'any.required': 'Category is required',
    }),
  latitude: Joi.number().min(-90).max(90).required().messages({
    'number.base': 'Latitude must be a valid number',
    'number.min': 'Latitude must be between -90 and 90',
    'number.max': 'Latitude must be between -90 and 90',
    'any.required': 'Latitude is required',
  }),
  longitude: Joi.number().min(-180).max(180).required().messages({
    'number.base': 'Longitude must be a valid number',
    'number.min': 'Longitude must be between -180 and 180',
    'number.max': 'Longitude must be between -180 and 180',
    'any.required': 'Longitude is required',
  }),
  locality_name: Joi.string().trim().max(150).allow('', null).optional().messages({
    'string.max': 'Locality name cannot exceed 150 characters',
  }),
});

/**
 * Validation schema for updating an existing post
 */
const updatePostSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).optional().messages({
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title cannot exceed 200 characters',
  }),
  content: Joi.string().trim().min(10).max(5000).optional().messages({
    'string.min': 'Content must be at least 10 characters long',
    'string.max': 'Content cannot exceed 5000 characters',
  }),
  category: Joi.string()
    .valid(...ALLOWED_CATEGORIES)
    .optional()
    .messages({
      'any.only': `Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`,
    }),
}).min(1).messages({
  'object.min': 'At least one field (title, content, or category) must be provided to update',
});

/**
 * Validation schema for querying nearby feed (GET query parameters)
 */
const feedQuerySchema = Joi.object({
  latitude: Joi.number().min(-90).max(90).required().messages({
    'number.base': 'Latitude query parameter is required and must be a number',
    'number.min': 'Latitude must be between -90 and 90',
    'number.max': 'Latitude must be between -90 and 90',
    'any.required': 'Latitude query parameter is required',
  }),
  longitude: Joi.number().min(-180).max(180).required().messages({
    'number.base': 'Longitude query parameter is required and must be a number',
    'number.min': 'Longitude must be between -180 and 180',
    'number.max': 'Longitude must be between -180 and 180',
    'any.required': 'Longitude query parameter is required',
  }),
  radius_km: Joi.number().positive().max(50).default(5).messages({
    'number.base': 'Radius must be a number in kilometers (e.g. 5 or 10)',
    'number.positive': 'Radius must be a positive number',
    'number.max': 'Radius cannot exceed 50 km',
  }),
  category: Joi.string()
    .valid(...ALLOWED_CATEGORIES)
    .optional()
    .messages({
      'any.only': `Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`,
    }),
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Page must be an integer',
    'number.min': 'Page must be at least 1',
  }),
  limit: Joi.number().integer().min(1).max(50).default(10).messages({
    'number.base': 'Limit must be an integer',
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit cannot exceed 50',
  }),
});

export {
  createPostSchema,
  updatePostSchema,
  feedQuerySchema,
};

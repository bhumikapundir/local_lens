// Validation Middleware: validates incoming request payload against a given Joi schema.
import { ApiError } from '../../utils/ApiError.js';

/**
 * Higher-order middleware that validates req.body against a Joi schema.
 * @param {import('joi').ObjectSchema} schema 
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, ''),
      }));

      const primaryMessage = errorDetails[0]?.message || 'Validation failed';
      return next(new ApiError(400, primaryMessage, errorDetails));
    }

    // Replace req.body with sanitized/validated value
    req.body = value;
    next();
  };
};

// Validation Middleware: validates incoming request payload against a given Joi schema.
import { ApiError } from '../../utils/ApiError.js';

/**
 * Higher-order middleware that validates request data against a Joi schema.
 * @param {import('joi').ObjectSchema} schema 
 * @param {'body' | 'query' | 'params'} [source='body'] - Request object property to validate
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[source] || {};
    const { error, value } = schema.validate(dataToValidate, {
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

    // Replace target source with sanitized/validated value
    req[source] = value;
    next();
  };
};


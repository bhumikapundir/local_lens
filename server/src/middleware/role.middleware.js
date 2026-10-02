// Role Authorization Middleware: restricts access to endpoints based on user roles (USER, MODERATOR).
import { ApiError } from '../../utils/ApiError.js';

/**
 * Authorize only users with specified roles.
 * @param {...string} allowedRoles - List of authorized roles ('USER', 'MODERATOR')
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required before role verification.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access forbidden: role '${req.user.role}' is not authorized to access this resource.`
        )
      );
    }

    next();
  };
};

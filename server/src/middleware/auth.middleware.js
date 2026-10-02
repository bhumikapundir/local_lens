// Authentication Middleware: verifies the JWT token from HTTP-only cookies (or Authorization header fallback),
// verifies user existence in the database, and attaches user context to req.user.
import pool from '../config/db.js';
import { verifyToken } from '../../utils/jwt.js';
import { ApiError } from '../../utils/ApiError.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Primary: Extract from HTTP-only cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Secondary / Fallback: Extract from Authorization Bearer header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Authentication token required. Please log in.');
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Authentication token has expired. Please log in again.');
    }
    throw new ApiError(401, 'Invalid authentication token.');
  }

  // Fetch active user from database to ensure up-to-date state
  const query = `
    SELECT id, name, email, role, reputation_score, is_verified, created_at, updated_at
    FROM users
    WHERE id = $1;
  `;
  const result = await pool.query(query, [decoded.id]);

  if (result.rows.length === 0) {
    throw new ApiError(401, 'User associated with this token no longer exists.');
  }

  req.user = result.rows[0];
  next();
});

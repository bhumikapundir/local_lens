// JWT Utility: handles signing and verification of JSON Web Tokens for stateless user authentication.
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'locallens_default_jwt_secret_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generates a signed JWT token containing the given payload.
 * @param {Object} payload - User identity details (id, email, role)
 * @returns {string} Signed JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verifies a JWT token against the secret key.
 * @param {string} token - The raw JWT token string
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

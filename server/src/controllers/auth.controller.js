// Auth Controller: manages user registration, authentication, profile lookup, and session termination.
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import { generateToken } from '../../utils/jwt.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // 1. Check if user with this email already exists
  const existingUserCheck = await pool.query(
    'SELECT id FROM users WHERE email = $1 LIMIT 1;',
    [email]
  );

  if (existingUserCheck.rows.length > 0) {
    throw new ApiError(409, 'An account with this email address already exists.');
  }

  // 2. Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // 3. Insert user into database
  const insertQuery = `
    INSERT INTO users (name, email, password_hash, role)
    VALUES ($1, $2, $3, COALESCE($4::user_role, 'USER'::user_role))
    RETURNING id, name, email, role, reputation_score, is_verified, created_at, updated_at;
  `;
  const result = await pool.query(insertQuery, [name, email, passwordHash, role || 'USER']);
  const newUser = result.rows[0];

  // 4. Generate JWT
  const token = generateToken({
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
  });

  // 5. Set HTTP-Only Cookie
  res.cookie('token', token, COOKIE_OPTIONS);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: newUser,
      },
      'User registered successfully'
    )
  );
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Fetch user by email
  const query = `
    SELECT id, name, email, password_hash, role, reputation_score, is_verified, created_at, updated_at
    FROM users
    WHERE email = $1 LIMIT 1;
  `;
  const result = await pool.query(query, [email]);

  if (result.rows.length === 0) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const user = result.rows[0];

  // 2. Validate password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  // 3. Generate JWT
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  // 4. Set HTTP-Only Cookie
  res.cookie('token', token, COOKIE_OPTIONS);

  // 5. Remove password hash from response
  const { password_hash, ...userProfile } = user;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: userProfile,
      },
      'Login successful'
    )
  );
});

/**
 * @desc    Get currently authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private (Authenticated users only)
 */
  const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, req.user, 'User profile retrieved successfully')
  );
});

/**
 * @desc    Log out current user (clears HTTP-only token cookie)
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', {
    httpOnly: COOKIE_OPTIONS.httpOnly,
    secure: COOKIE_OPTIONS.secure,
    sameSite: COOKIE_OPTIONS.sameSite,
});

  return res.status(200).json(
    new ApiResponse(200, null, 'User logged out successfully')
  );
});


export{
  register,
  login,
  getCurrentUser,
  logout
}
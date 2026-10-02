// Auth Router: defines endpoints for user registration, authentication, profile fetching, and session logout.
import { Router } from 'express';
import {
  register,
  login,
  getCurrentUser,
  logout,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

const router = Router();

// Public auth routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Protected routes (require valid JWT)
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);

export default router;

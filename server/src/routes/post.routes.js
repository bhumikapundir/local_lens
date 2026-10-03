// Post Routes: defines API endpoints for creating, querying, updating, and deleting location-tagged posts.
import { Router } from 'express';
import {
  createPost,
  getNearbyFeed,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
} from '../controllers/post.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createPostSchema,
  updatePostSchema,
  feedQuerySchema,
} from '../validators/post.validator.js';

const router = Router();

// 1. Hyperlocal Spatial Feed (Public location query)
router.get('/feed', validate(feedQuerySchema, 'query'), getNearbyFeed);

// 2. Fetch authenticated user's own posts
router.get('/me', authenticate, getMyPosts);

// 3. Create a new location-tagged post (Authenticated + optional image upload)
router.post(
  '/',
  authenticate,
  upload.single('image'),
  validate(createPostSchema),
  createPost
);

// 4. Single post details
router.get('/:id', getPostById);

// 5. Update post (Owner only)
router.patch('/:id', authenticate, validate(updatePostSchema), updatePost);

// 6. Delete post (Owner or MODERATOR)
router.delete('/:id', authenticate, deletePost);

export default router;

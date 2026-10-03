// Post Controller: manages hyperlocal post creation with PostGIS spatial indexing,
// radius-based feed discovery, TTL expiration management, and post lifecycle actions.
import pool from '../config/db.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../../utils/cloudinary.js';

/**
 * Helper to calculate dynamic post TTL expiration based on category.
 * @param {string} category 
 * @returns {Date} Expiration timestamp
 */

const calculateExpiry = (category) => {
  const now = new Date();
  switch (category) {
    case 'ALERT':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
    case 'TRAFFIC':
      return new Date(now.getTime() + 12 * 60 * 60 * 1000); // 12 hours
    case 'NEWS':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    case 'EVENT':
      return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days
    case 'ANNOUNCEMENT':
      return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days
    case 'LOST_FOUND':
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    case 'COMMUNITY':
      return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days
    default:
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  }
};

/**
 * @desc    Create a new location-tagged post
 * @route   POST /api/posts
 * @access  Private (Authenticated users only)
 */
const createPost = asyncHandler(async (req, res) => {
  const { title, content, category, latitude, longitude, locality_name } = req.body;
  const userId = req.user.id;

  // 1. Handle optional image upload to Cloudinary
  let imageUrl = null;
  if (req.file) {
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (uploadResult) {
      imageUrl = uploadResult.secure_url;
    }
  }

  // 2. Calculate dynamic TTL expiration
  const expiresAt = calculateExpiry(category);

  // 3. Insert Post with PostGIS Geography Point (Longitude X, Latitude Y)
  const insertQuery = `
    INSERT INTO posts (
      user_id,
      title,
      content,
      category,
      location,
      locality_name,
      image_url,
      expires_at
    )
    VALUES (
      $1,
      $2,
      $3,
      $4::post_category,
      ST_SetSRID(ST_MakePoint($5, $6), 4326)::geography,
      $7,
      $8,
      $9
    )
    RETURNING 
      id, user_id, title, content, category, locality_name, image_url,
      status, expires_at, confirmations_count, reports_count, created_at, updated_at;
  `;

  const values = [
    userId,
    title,
    content,
    category,
    Number(longitude), // Longitude is X
    Number(latitude),  // Latitude is Y
    locality_name || null,
    imageUrl,
    expiresAt,
  ];

  const result = await pool.query(insertQuery, values);
  const newPost = result.rows[0];

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        post: {
          ...newPost,
          author: {
            id: req.user.id,
            name: req.user.name,
            reputation_score: req.user.reputation_score,
            is_verified: req.user.is_verified,
          },
        },
      },
      'Post created successfully'
    )
  );
});

/**
 * @desc    Get nearby posts within a given radius using PostGIS ST_DWithin
 * @route   GET /api/posts/feed
 * @access  Public
 */
const getNearbyFeed = asyncHandler(async (req, res) => {
  const {
    latitude,
    longitude,
    radius_km = 5,
    category,
    page = 1,
    limit = 10,
  } = req.query;

  const lat = Number(latitude);
  const lng = Number(longitude);
  const radiusMeters = Number(radius_km) * 1000;
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const offset = (pageNum - 1) * limitNum;

  // Build filter conditions
  const conditions = [
    `ST_DWithin(p.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)`,
    `p.status = 'ACTIVE'`,
    `(p.expires_at IS NULL OR p.expires_at > NOW())`,
  ];
  const queryParams = [lng, lat, radiusMeters];

  if (category) {
    queryParams.push(category);
    conditions.push(`p.category = $${queryParams.length}::post_category`);
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  // 1. Get total count for pagination metadata
  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM posts p
    ${whereClause};
  `;
  const countResult = await pool.query(countQuery, queryParams);
  const totalPosts = countResult.rows[0]?.total || 0;

  // 2. Fetch paginated posts with computed relative distance and author info
  const feedQuery = `
    SELECT 
      p.id,
      p.title,
      p.content,
      p.category,
      p.locality_name,
      p.image_url,
      p.status,
      p.expires_at,
      p.confirmations_count,
      p.reports_count,
      p.created_at,
      p.updated_at,
      ROUND(ST_Distance(p.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography)::numeric, 0) AS distance_meters,
      ROUND((ST_Distance(p.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) / 1000.0)::numeric, 2) AS distance_km,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'reputation_score', u.reputation_score,
        'is_verified', u.is_verified
      ) AS author
    FROM posts p
    INNER JOIN users u ON p.user_id = u.id
    ${whereClause}
    ORDER BY p.created_at DESC
    LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2};
  `;

  queryParams.push(limitNum, offset);
  const feedResult = await pool.query(feedQuery, queryParams);

  const totalPages = Math.ceil(totalPosts / limitNum) || 1;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        posts: feedResult.rows,
        pagination: {
          total: totalPosts,
          page: pageNum,
          limit: limitNum,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
        locationContext: {
          latitude: lat,
          longitude: lng,
          radius_km: Number(radius_km),
        },
      },
      'Hyperlocal feed retrieved successfully'
    )
  );
});

/**
 * @desc    Get single post details by ID
 * @route   GET /api/posts/:id
 * @access  Public
 */
const getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { latitude, longitude } = req.query;

  let distanceCalculation = 'NULL AS distance_meters, NULL AS distance_km';
  const queryParams = [id];

  if (latitude && longitude) {
    queryParams.push(Number(longitude), Number(latitude));
    distanceCalculation = `
      ROUND(ST_Distance(p.location, ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography)::numeric, 0) AS distance_meters,
      ROUND((ST_Distance(p.location, ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography) / 1000.0)::numeric, 2) AS distance_km
    `;
  }

  const query = `
    SELECT 
      p.id,
      p.title,
      p.content,
      p.category,
      p.locality_name,
      p.image_url,
      p.status,
      p.expires_at,
      p.confirmations_count,
      p.reports_count,
      p.created_at,
      p.updated_at,
      ${distanceCalculation},
      json_build_object(
        'id', u.id,
        'name', u.name,
        'reputation_score', u.reputation_score,
        'is_verified', u.is_verified
      ) AS author
    FROM posts p
    INNER JOIN users u ON p.user_id = u.id
    WHERE p.id = $1 AND p.status != 'REMOVED';
  `;

  const result = await pool.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new ApiError(404, 'Post not found or has been removed');
  }

  return res.status(200).json(
    new ApiResponse(200, { post: result.rows[0] }, 'Post details retrieved successfully')
  );
});

/**
 * @desc    Get all posts created by the authenticated user
 * @route   GET /api/posts/me
 * @access  Private
 */
const getMyPosts = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // 1. Total count
  const countQuery = `SELECT COUNT(*)::int AS total FROM posts WHERE user_id = $1;`;
  const countResult = await pool.query(countQuery, [userId]);
  const totalPosts = countResult.rows[0]?.total || 0;

  // 2. Fetch user's posts
  const query = `
    SELECT 
      id, title, content, category, locality_name, image_url,
      status, expires_at, confirmations_count, reports_count,
      created_at, updated_at
    FROM posts
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3;
  `;

  const result = await pool.query(query, [userId, limit, offset]);
  const totalPages = Math.ceil(totalPosts / limit) || 1;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        posts: result.rows,
        pagination: {
          total: totalPosts,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      'User posts retrieved successfully'
    )
  );
});

/**
 * @desc    Update post details (Owner only)
 * @route   PATCH /api/posts/:id
 * @access  Private
 */
const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, category } = req.body;
  const userId = req.user.id;

  // 1. Check post existence and ownership
  const postCheck = await pool.query(
    'SELECT id, user_id, category FROM posts WHERE id = $1;',
    [id]
  );

  if (postCheck.rows.length === 0) {
    throw new ApiError(404, 'Post not found.');
  }

  const existingPost = postCheck.rows[0];
  if (existingPost.user_id !== userId) {
    throw new ApiError(403, 'Forbidden: You can only edit your own posts.');
  }

  // 2. Build dynamic update query
  const updates = [];
  const queryParams = [id];

  if (title) {
    queryParams.push(title);
    updates.push(`title = $${queryParams.length}`);
  }

  if (content) {
    queryParams.push(content);
    updates.push(`content = $${queryParams.length}`);
  }

  if (category) {
    queryParams.push(category);
    updates.push(`category = $${queryParams.length}::post_category`);
    // Recalculate expiry for updated category
    const newExpiresAt = calculateExpiry(category);
    queryParams.push(newExpiresAt);
    updates.push(`expires_at = $${queryParams.length}`);
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);

  const updateQuery = `
    UPDATE posts
    SET ${updates.join(', ')}
    WHERE id = $1
    RETURNING id, user_id, title, content, category, locality_name, image_url, status, expires_at, updated_at;
  `;

  const result = await pool.query(updateQuery, queryParams);

  return res.status(200).json(
    new ApiResponse(200, { post: result.rows[0] }, 'Post updated successfully')
  );
});

/**
 * @desc    Delete a post (Owner or MODERATOR)
 * @route   DELETE /api/posts/:id
 * @access  Private (Owner or MODERATOR)
 */
const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  // 1. Check post existence
  const postCheck = await pool.query(
    'SELECT id, user_id FROM posts WHERE id = $1;',
    [id]
  );

  if (postCheck.rows.length === 0) {
    throw new ApiError(404, 'Post not found.');
  }

  const existingPost = postCheck.rows[0];

  // 2. Check authorization: Post author OR MODERATOR
  if (existingPost.user_id !== userId && userRole !== 'MODERATOR') {
    throw new ApiError(403, 'Forbidden: You are not authorized to delete this post.');
  }

  // 3. Delete post (Cascades reports and verifications automatically)
  await pool.query('DELETE FROM posts WHERE id = $1;', [id]);

  return res.status(200).json(
    new ApiResponse(200, { id }, 'Post deleted successfully')
  );
});

export {
  calculateExpiry,
  createPost,
  getNearbyFeed,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
};

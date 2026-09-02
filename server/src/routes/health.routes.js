// Health check route: exposes GET /api/health to report server runtime status,
// timestamp, and PostgreSQL/PostGIS database connectivity.
import { Router } from 'express';
import { checkDatabaseHealth } from '../config/db.js';

const router = Router();

router.get('/health', async (req, res) => {
  const dbHealth = await checkDatabaseHealth();

  const isHealthy = dbHealth.status === 'UP';
  const statusCode = isHealthy ? 200 : 503;

  res.status(statusCode).json({
    success: isHealthy,
    status: isHealthy ? 'healthy' : 'degraded',
    service: 'LocalLens Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: dbHealth,
    environment: process.env.NODE_ENV || 'development',
  });
});

export default router;

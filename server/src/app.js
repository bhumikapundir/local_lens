// Express app configuration: registers global security middlewares (Helmet, CORS), request parsers,
// route handlers, and centralized error handling middleware.
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import healthRoutes from './routes/health.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// Security & utility middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to LocalLens API — Hyperlocal News & Bulletin Platform',
    version: '1.0.0',
    docs: '/api/health',
  });
});

// API Routes
app.use('/api', healthRoutes);

// Catch 404 & Global Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

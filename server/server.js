// Main entrypoint: starts the Express HTTP server, checks database/PostGIS connectivity on startup,
// and handles graceful server shutdown signals.
import app from './src/app.js';
import dotenv from 'dotenv';
import { checkDatabaseHealth } from './src/config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const server = app.listen(PORT, async () => {
    console.log(`\n==================================================`);
    console.log(`🚀 LocalLens Server is running on port: ${PORT}`);
    console.log(`🌐 Local URL: http://localhost:${PORT}`);
    console.log(`🩺 Healthcheck: http://localhost:${PORT}/api/health`);
    console.log(`==================================================\n`);

    // Check DB status on startup
    console.log('🔍 Checking Database & PostGIS connectivity...');
    const dbStatus = await checkDatabaseHealth();
    if (dbStatus.status === 'UP') {
      console.log(`✅ Database Connected! PostGIS Version: ${dbStatus.postgisVersion}`);
    } else {
      console.warn(`⚠️ Database connection pending or offline: ${dbStatus.error}`);
      console.warn(`💡 Tip: Start PostgreSQL or run 'docker compose up -d'`);
    }
  });

  // Graceful shutdown handling
  const shutdown = () => {
    console.log('\n🛑 Gracefully shutting down LocalLens server...');
    server.close(() => {
      console.log('💤 HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

startServer();

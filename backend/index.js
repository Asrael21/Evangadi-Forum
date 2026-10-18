import './env.js';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './db/config.js';
import { mainRouter } from './src/api/routes.js';
import { errorHandler } from './src/middleware/error-handler.js';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/docs/swagger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Swagger UI ──────────────────────────────────────────────────────────────
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Evangadi Forum API Docs',
    swaggerOptions: {
      persistAuthorization: true,   // keeps the JWT in the Authorize box across reloads
      displayRequestDuration: true,
      filter: true,
      tryItOutEnabled: true,
    },
  }),
);

// Raw spec (for external tools like Postman import)
app.get('/api/docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// API routes
app.use('/api', mainRouter);

// Catch unhandled API routes so they return JSON 404 instead of HTML
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Serve static frontend build in production / single-service deployment
const frontendDist = path.resolve(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));

  // SPA fallback: send index.html for all GET client-side page routes
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && req.path !== '/health') {
      return res.sendFile(path.join(frontendDist, 'index.html'));
    }
    next();
  });
}

app.use(errorHandler);

// Start server
const startServer = async () => {
  // Start listening immediately so health checks and reverse proxy (Traefik/Coolify) succeed
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port} (http://0.0.0.0:${port})`);
  });

  try {
    // Test database connection
    const connection = await db.getConnection();
    console.log('✅ Database connection established successfully.');
    connection.release();
  } catch (error) {
    console.error(
      '❌ Database connection failed. Please check your DB credentials in DockHosting:',
      error.message,
    );
  }
};

startServer();

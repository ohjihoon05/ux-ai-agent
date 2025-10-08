#!/usr/bin/env node
/**
 * Express API Server with Security Middleware
 * Migrated from native HTTP to Express.js for better security
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as componentQueries from '../db/queries/components.js';
import * as analyticsQueries from '../db/queries/analytics.js';
import * as variantQueries from '../db/queries/variants.js';
import * as presetQueries from '../db/queries/presets.js';
import * as designSystemQueries from '../db/queries/design-systems.js';
import * as presetUsageQueries from '../db/queries/preset-usage.js';
import {
  componentValidation,
  analyticsValidation,
  designSystemValidation,
  presetValidation,
  queryValidation,
  idValidation
} from './validators.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const API_PORT = parseInt(process.env.API_PORT) || 3001;
const WEB_PORT = parseInt(process.env.PORT) || 3000;

// Security Middleware - Phase 3
// 1. Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// 2. CORS Policy
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
      : ['http://localhost:3000'];

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// 3. Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser middleware (for Figma token security)
app.use(cookieParser(process.env.SESSION_SECRET || 'your-secret-key-change-in-production'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// GET /api/components - List components
app.get('/api/components', queryValidation.pagination, async (req, res, next) => {
  try {
    const category = req.query.category;
    const sort = req.query.sort || 'usage';
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const filters = { category, sort, limit, offset };
    const components = componentQueries.getAllComponents(filters);

    res.json({
      components,
      total: components.length,
      limit,
      offset
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/components/:id - Get component by ID
app.get('/api/components/:id', idValidation, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const component = componentQueries.getComponentById(id);

    if (!component) {
      return res.status(404).json({ error: 'Component not found' });
    }

    res.json(component);
  } catch (err) {
    next(err);
  }
});

// POST /api/components/:id/copy - Track component copy
app.post('/api/components/:id/copy', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    // Increment usage count
    componentQueries.incrementUsageCount(id);

    // Track analytics
    analyticsQueries.trackCopy(id, req.body.variantId, req.body.customizations);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// GET /api/search - Search components
app.get('/api/search', queryValidation.search, async (req, res, next) => {
  try {
    const query = req.query.q;
    const category = req.query.category;
    const limit = parseInt(req.query.limit) || 10;

    if (!query) {
      return res.json({ results: [], total: 0, query: '' });
    }

    const results = componentQueries.searchComponents(query, { category, limit });

    // Track search
    analyticsQueries.trackSearch(query, results.length);

    res.json({
      results,
      total: results.length,
      query
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/categories - Get all categories
app.get('/api/categories', async (req, res, next) => {
  try {
    const categories = componentQueries.getCategoriesWithCounts();
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

// POST /api/analytics/events - Track analytics event
app.post('/api/analytics/events', analyticsValidation.createEvent, async (req, res, next) => {
  try {
    const eventId = analyticsQueries.trackEvent({
      component_id: req.body.componentId,
      variant_id: req.body.variantId,
      event_type: req.body.eventType,
      metadata: req.body.metadata
    });

    res.json({ success: true, eventId });
  } catch (err) {
    next(err);
  }
});

// GET /api/analytics/popular - Get popular components
app.get('/api/analytics/popular', async (req, res, next) => {
  try {
    const period = req.query.period || 'week';
    const limit = parseInt(req.query.limit) || 10;

    const components = analyticsQueries.getPopularComponentsByPeriod(period, limit);

    res.json({ components });
  } catch (err) {
    next(err);
  }
});

// GET /api/analytics/summary - Get analytics summary
app.get('/api/analytics/summary', async (req, res, next) => {
  try {
    const summary = analyticsQueries.getAnalyticsSummary();
    res.json(summary);
  } catch (err) {
    next(err);
  }
});

// GET /api/components/:id/variants - Get component variants
app.get('/api/components/:id/variants', idValidation, async (req, res, next) => {
  try {
    const componentId = parseInt(req.params.id);
    const variants = variantQueries.getComponentVariants(componentId);
    res.json(variants);
  } catch (err) {
    next(err);
  }
});

// GET /api/variants/:id - Get variant by ID
app.get('/api/variants/:id', idValidation, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const variant = variantQueries.getVariantById(id);

    if (!variant) {
      return res.status(404).json({ error: 'Variant not found' });
    }

    res.json(variant);
  } catch (err) {
    next(err);
  }
});

// GET /api/components/:id/presets - Get component presets
app.get('/api/components/:id/presets', idValidation, async (req, res, next) => {
  try {
    const componentId = parseInt(req.params.id);
    const presets = presetQueries.getComponentPresets(componentId);
    res.json(presets);
  } catch (err) {
    next(err);
  }
});

// GET /api/presets/:id - Get preset by ID
app.get('/api/presets/:id', idValidation, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const preset = presetQueries.getPresetById(id);

    if (!preset) {
      return res.status(404).json({ error: 'Preset not found' });
    }

    res.json(preset);
  } catch (err) {
    next(err);
  }
});

// POST /api/presets - Create new preset
app.post('/api/presets', presetValidation.create, async (req, res, next) => {
  try {
    const presetId = presetQueries.createPreset(
      req.body.componentId,
      req.body.name,
      req.body.customization,
      req.body.description
    );

    res.status(201).json({ success: true, presetId });
  } catch (err) {
    next(err);
  }
});

// PUT /api/presets/:id - Update preset
app.put('/api/presets/:id', idValidation, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const success = presetQueries.updatePreset(id, req.body);

    if (!success) {
      return res.status(404).json({ error: 'Preset not found or no changes made' });
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/presets/:id - Delete preset
app.delete('/api/presets/:id', idValidation, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const success = presetQueries.deletePreset(id);

    if (!success) {
      return res.status(404).json({ error: 'Preset not found' });
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// GET /api/presets/popular - Get popular presets
app.get('/api/presets/popular', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const presets = presetQueries.getPopularPresets(limit);
    res.json(presets);
  } catch (err) {
    next(err);
  }
});

// GET /api/design-systems - Get all design systems
app.get('/api/design-systems', async (req, res, next) => {
  try {
    const systems = designSystemQueries.getAllDesignSystems();
    res.json(systems);
  } catch (err) {
    next(err);
  }
});

// GET /api/design-systems/:id - Get design system by ID
app.get('/api/design-systems/:id', idValidation, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const system = designSystemQueries.getDesignSystemById(id);

    if (!system) {
      return res.status(404).json({ error: 'Design system not found' });
    }

    res.json(system);
  } catch (err) {
    next(err);
  }
});

// GET /api/design-systems/active - Get active design system
app.get('/api/design-systems/active', async (req, res, next) => {
  try {
    const system = designSystemQueries.getActiveDesignSystem();

    if (!system) {
      return res.status(404).json({ error: 'No active design system' });
    }

    res.json(system);
  } catch (err) {
    next(err);
  }
});

// POST /api/design-systems - Create design system
app.post('/api/design-systems', designSystemValidation.create, async (req, res, next) => {
  try {
    const systemId = designSystemQueries.createDesignSystem(req.body);
    res.status(201).json({ success: true, systemId });
  } catch (err) {
    next(err);
  }
});

// PUT /api/design-systems/:id - Update design system
app.put('/api/design-systems/:id', idValidation, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const success = designSystemQueries.updateDesignSystem(id, req.body);

    if (!success) {
      return res.status(404).json({ error: 'Design system not found or no changes made' });
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/design-systems/:id - Delete design system
app.delete('/api/design-systems/:id', idValidation, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const success = designSystemQueries.deleteDesignSystem(id);

    if (!success) {
      return res.status(404).json({ error: 'Design system not found' });
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// GET /api/design-systems/:id/export - Export design system
app.get('/api/design-systems/:id/export', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const data = designSystemQueries.exportDesignSystem(id);

    if (!data) {
      return res.status(404).json({ error: 'Design system not found' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// POST /api/design-systems/import - Import design system
app.post('/api/design-systems/import', async (req, res, next) => {
  try {
    const systemId = designSystemQueries.importDesignSystem(req.body);
    res.status(201).json({ success: true, systemId });
  } catch (error) {
    res.status(400).json({ error: 'Invalid design system data' });
  }
});

// POST /api/design-systems/:id/apply - Apply design system to components
app.post('/api/design-systems/:id/apply', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const system = designSystemQueries.getDesignSystemById(id);

    if (!system) {
      return res.status(404).json({ error: 'Design system not found' });
    }

    // Set as active
    designSystemQueries.setActiveDesignSystem(id);

    res.json({ success: true, message: 'Design system applied to all components' });
  } catch (err) {
    next(err);
  }
});

// ===== Figma Integration Endpoints (User Story 3 - Secure Token Storage) =====

// POST /api/figma/auth - Store Figma token securely in httpOnly cookie
app.post('/api/figma/auth', (req, res) => {
  try {
    const { token } = req.body;

    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      return res.status(400).json({
        error: 'Figma token is required',
        timestamp: new Date().toISOString()
      });
    }

    // Store token in httpOnly cookie (not accessible via JavaScript)
    res.cookie('figma_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/'
    });

    res.json({
      success: true,
      message: 'Figma token stored securely',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to store Figma token',
      timestamp: new Date().toISOString()
    });
  }
});

// DELETE /api/figma/auth - Remove Figma token (logout)
app.delete('/api/figma/auth', (req, res) => {
  try {
    res.clearCookie('figma_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    res.json({
      success: true,
      message: 'Figma token removed',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to remove Figma token',
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/figma/status - Check if Figma token exists
app.get('/api/figma/status', (req, res) => {
  const hasToken = !!req.cookies.figma_token;

  res.json({
    authenticated: hasToken,
    timestamp: new Date().toISOString()
  });
});

// Middleware to validate Figma token from cookie
const requireFigmaToken = (req, res, next) => {
  const token = req.cookies.figma_token;

  if (!token) {
    return res.status(401).json({
      error: 'Figma authentication required',
      message: 'Please authenticate with Figma first',
      timestamp: new Date().toISOString()
    });
  }

  // Attach token to request for use in handlers
  req.figmaToken = token;
  next();
};

// GET /api/figma/files/:fileKey - Fetch Figma file (requires auth)
app.get('/api/figma/files/:fileKey', requireFigmaToken, async (req, res, next) => {
  try {
    const { fileKey } = req.params;
    const token = req.figmaToken;

    // Fetch from Figma API
    const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
      headers: {
        'X-Figma-Token': token
      }
    });

    if (!response.ok) {
      if (response.status === 403) {
        return res.status(403).json({
          error: 'Invalid or expired Figma token',
          message: 'Please re-authenticate with Figma'
        });
      }
      throw new Error(`Figma API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// POST /api/figma/import - Import components from Figma (requires auth)
app.post('/api/figma/import', requireFigmaToken, async (req, res, next) => {
  try {
    const { fileKey, nodeIds } = req.body;
    const token = req.figmaToken;

    if (!fileKey || !nodeIds || !Array.isArray(nodeIds)) {
      return res.status(400).json({
        error: 'Missing required fields: fileKey and nodeIds'
      });
    }

    // Fetch from Figma API
    const response = await fetch(`https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeIds.join(',')}`, {
      headers: {
        'X-Figma-Token': token
      }
    });

    if (!response.ok) {
      if (response.status === 403) {
        return res.status(403).json({
          error: 'Invalid or expired Figma token',
          message: 'Please re-authenticate with Figma'
        });
      }
      throw new Error(`Figma API error: ${response.status}`);
    }

    const data = await response.json();

    // Store imported components in database
    // (This would integrate with your component storage logic)

    res.json({
      success: true,
      imported: nodeIds.length,
      data
    });
  } catch (err) {
    next(err);
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, '../../dist');

  // Serve static assets
  app.use(express.static(distPath));

  // SPA fallback - serve index.html for all non-API routes
  app.use((req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return next();
    }
    // Serve index.html for all other routes (SPA routing)
    if (req.method === 'GET') {
      res.sendFile(join(distPath, 'index.html'));
    } else {
      next();
    }
  });
}

// 404 handler for API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({
      error: 'API endpoint not found',
      path: req.path,
      timestamp: new Date().toISOString()
    });
  } else {
    next();
  }
});

// Centralized Error Handler - Phase 3
app.use((err, req, res, next) => {
  // Log error details
  console.error('[ERROR]', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Handle specific error types
  let status = err.status || 500;
  let message = err.message;

  // CORS errors
  if (err.message === 'Not allowed by CORS') {
    status = 403;
    message = 'CORS policy violation';
  }

  // Rate limit errors
  if (err.status === 429) {
    status = 429;
    message = 'Too many requests, please try again later';
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Invalid request data';
  }

  // Database errors
  if (err.code === 'SQLITE_ERROR') {
    status = 500;
    message = process.env.NODE_ENV === 'production'
      ? 'Database error'
      : err.message;
  }

  // Send error response
  res.status(status).json({
    error: process.env.NODE_ENV === 'production' && status === 500
      ? 'Internal server error'
      : message,
    timestamp: new Date().toISOString(),
    path: req.path,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server(s)
if (process.env.NODE_ENV === 'production') {
  // In production, serve both web and API on their respective ports
  app.listen(API_PORT, () => {
    console.log(`🚀 API Server running on http://localhost:${API_PORT}`);
    console.log(`📡 Endpoints available at http://localhost:${API_PORT}/api/...`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Also listen on web port for static files
  app.listen(WEB_PORT, () => {
    console.log(`🌐 Web Server running on http://localhost:${WEB_PORT}`);
    console.log(`📦 Serving static files from dist/`);
  });
} else {
  // In development, only API server (Vite handles web)
  app.listen(API_PORT, () => {
    console.log(`🚀 API Server running on http://localhost:${API_PORT}`);
    console.log(`📡 Endpoints available at http://localhost:${API_PORT}/api/...`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down API server...');
  process.exit(0);
});

export default app;

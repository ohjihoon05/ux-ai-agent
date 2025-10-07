#!/usr/bin/env node
/**
 * Simple API Server
 * Provides REST endpoints for the component library
 */

import http from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as componentQueries from '../db/queries/components.js';
import * as analyticsQueries from '../db/queries/analytics.js';
import * as variantQueries from '../db/queries/variants.js';
import * as presetQueries from '../db/queries/presets.js';
import * as designSystemQueries from '../db/queries/design-systems.js';
import * as presetUsageQueries from '../db/queries/preset-usage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.API_PORT || 3001;

/**
 * Parse request body
 */
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

/**
 * Send JSON response
 */
function sendJSON(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

/**
 * Handle API routes
 */
async function handleRequest(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;
  const method = req.method;

  console.log(`${method} ${path}`);

  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  try {
    // GET /api/components - List components
    if (path === '/api/components' && method === 'GET') {
      const category = url.searchParams.get('category');
      const sort = url.searchParams.get('sort') || 'usage';
      const limit = parseInt(url.searchParams.get('limit')) || 20;
      const offset = parseInt(url.searchParams.get('offset')) || 0;

      const filters = { category, sort, limit, offset };
      const components = componentQueries.getAllComponents(filters);

      sendJSON(res, {
        components,
        total: components.length,
        limit,
        offset
      });
      return;
    }

    // GET /api/components/:id - Get component by ID
    if (path.match(/^\/api\/components\/\d+$/) && method === 'GET') {
      const id = parseInt(path.split('/').pop());
      const component = componentQueries.getComponentById(id);

      if (!component) {
        sendJSON(res, { error: 'Component not found' }, 404);
        return;
      }

      sendJSON(res, component);
      return;
    }

    // POST /api/components/:id/copy - Track component copy
    if (path.match(/^\/api\/components\/\d+\/copy$/) && method === 'POST') {
      const id = parseInt(path.split('/')[3]);
      const body = await parseBody(req);

      // Increment usage count
      componentQueries.incrementUsageCount(id);

      // Track analytics
      analyticsQueries.trackCopy(id, body.variantId, body.customizations);

      sendJSON(res, { success: true });
      return;
    }

    // GET /api/search - Search components
    if (path === '/api/search' && method === 'GET') {
      const query = url.searchParams.get('q');
      const category = url.searchParams.get('category');
      const limit = parseInt(url.searchParams.get('limit')) || 10;

      if (!query) {
        sendJSON(res, { results: [], total: 0, query: '' });
        return;
      }

      const results = componentQueries.searchComponents(query, { category, limit });

      // Track search
      analyticsQueries.trackSearch(query, results.length);

      sendJSON(res, {
        results,
        total: results.length,
        query
      });
      return;
    }

    // GET /api/categories - Get all categories
    if (path === '/api/categories' && method === 'GET') {
      const categories = componentQueries.getCategoriesWithCounts();
      sendJSON(res, categories);
      return;
    }

    // POST /api/analytics/events - Track analytics event
    if (path === '/api/analytics/events' && method === 'POST') {
      const body = await parseBody(req);
      const eventId = analyticsQueries.trackEvent({
        component_id: body.componentId,
        variant_id: body.variantId,
        event_type: body.eventType,
        metadata: body.metadata
      });

      sendJSON(res, { success: true, eventId });
      return;
    }

    // GET /api/analytics/popular - Get popular components
    if (path === '/api/analytics/popular' && method === 'GET') {
      const period = url.searchParams.get('period') || 'week';
      const limit = parseInt(url.searchParams.get('limit')) || 10;

      const components = analyticsQueries.getPopularComponentsByPeriod(period, limit);

      sendJSON(res, { components });
      return;
    }

    // GET /api/analytics/summary - Get analytics summary
    if (path === '/api/analytics/summary' && method === 'GET') {
      const summary = analyticsQueries.getAnalyticsSummary();
      sendJSON(res, summary);
      return;
    }

    // GET /api/components/:id/variants - Get component variants
    if (path.match(/^\/api\/components\/\d+\/variants$/) && method === 'GET') {
      const componentId = parseInt(path.split('/')[3]);
      const variants = variantQueries.getComponentVariants(componentId);
      sendJSON(res, variants);
      return;
    }

    // GET /api/variants/:id - Get variant by ID
    if (path.match(/^\/api\/variants\/\d+$/) && method === 'GET') {
      const id = parseInt(path.split('/').pop());
      const variant = variantQueries.getVariantById(id);

      if (!variant) {
        sendJSON(res, { error: 'Variant not found' }, 404);
        return;
      }

      sendJSON(res, variant);
      return;
    }

    // GET /api/components/:id/presets - Get component presets
    if (path.match(/^\/api\/components\/\d+\/presets$/) && method === 'GET') {
      const componentId = parseInt(path.split('/')[3]);
      const presets = presetQueries.getComponentPresets(componentId);
      sendJSON(res, presets);
      return;
    }

    // GET /api/presets/:id - Get preset by ID
    if (path.match(/^\/api\/presets\/\d+$/) && method === 'GET') {
      const id = parseInt(path.split('/').pop());
      const preset = presetQueries.getPresetById(id);

      if (!preset) {
        sendJSON(res, { error: 'Preset not found' }, 404);
        return;
      }

      sendJSON(res, preset);
      return;
    }

    // POST /api/presets - Create new preset
    if (path === '/api/presets' && method === 'POST') {
      const body = await parseBody(req);

      if (!body.componentId || !body.name || !body.customization) {
        sendJSON(res, { error: 'Missing required fields' }, 400);
        return;
      }

      const presetId = presetQueries.createPreset(
        body.componentId,
        body.name,
        body.customization,
        body.description
      );

      sendJSON(res, { success: true, presetId }, 201);
      return;
    }

    // PUT /api/presets/:id - Update preset
    if (path.match(/^\/api\/presets\/\d+$/) && method === 'PUT') {
      const id = parseInt(path.split('/').pop());
      const body = await parseBody(req);

      const success = presetQueries.updatePreset(id, body);

      if (!success) {
        sendJSON(res, { error: 'Preset not found or no changes made' }, 404);
        return;
      }

      sendJSON(res, { success: true });
      return;
    }

    // DELETE /api/presets/:id - Delete preset
    if (path.match(/^\/api\/presets\/\d+$/) && method === 'DELETE') {
      const id = parseInt(path.split('/').pop());
      const success = presetQueries.deletePreset(id);

      if (!success) {
        sendJSON(res, { error: 'Preset not found' }, 404);
        return;
      }

      sendJSON(res, { success: true });
      return;
    }

    // GET /api/presets/popular - Get popular presets
    if (path === '/api/presets/popular' && method === 'GET') {
      const limit = parseInt(url.searchParams.get('limit')) || 10;
      const presets = presetQueries.getPopularPresets(limit);
      sendJSON(res, presets);
      return;
    }

    // GET /api/design-systems - Get all design systems
    if (path === '/api/design-systems' && method === 'GET') {
      const systems = designSystemQueries.getAllDesignSystems();
      sendJSON(res, systems);
      return;
    }

    // GET /api/design-systems/:id - Get design system by ID
    if (path.match(/^\/api\/design-systems\/\d+$/) && method === 'GET') {
      const id = parseInt(path.split('/').pop());
      const system = designSystemQueries.getDesignSystemById(id);

      if (!system) {
        sendJSON(res, { error: 'Design system not found' }, 404);
        return;
      }

      sendJSON(res, system);
      return;
    }

    // GET /api/design-systems/active - Get active design system
    if (path === '/api/design-systems/active' && method === 'GET') {
      const system = designSystemQueries.getActiveDesignSystem();

      if (!system) {
        sendJSON(res, { error: 'No active design system' }, 404);
        return;
      }

      sendJSON(res, system);
      return;
    }

    // POST /api/design-systems - Create design system
    if (path === '/api/design-systems' && method === 'POST') {
      const body = await parseBody(req);

      if (!body.name || !body.colors) {
        sendJSON(res, { error: 'Missing required fields' }, 400);
        return;
      }

      const systemId = designSystemQueries.createDesignSystem(body);
      sendJSON(res, { success: true, systemId }, 201);
      return;
    }

    // PUT /api/design-systems/:id - Update design system
    if (path.match(/^\/api\/design-systems\/\d+$/) && method === 'PUT') {
      const id = parseInt(path.split('/').pop());
      const body = await parseBody(req);

      const success = designSystemQueries.updateDesignSystem(id, body);

      if (!success) {
        sendJSON(res, { error: 'Design system not found or no changes made' }, 404);
        return;
      }

      sendJSON(res, { success: true });
      return;
    }

    // DELETE /api/design-systems/:id - Delete design system
    if (path.match(/^\/api\/design-systems\/\d+$/) && method === 'DELETE') {
      const id = parseInt(path.split('/').pop());
      const success = designSystemQueries.deleteDesignSystem(id);

      if (!success) {
        sendJSON(res, { error: 'Design system not found' }, 404);
        return;
      }

      sendJSON(res, { success: true });
      return;
    }

    // GET /api/design-systems/:id/export - Export design system
    if (path.match(/^\/api\/design-systems\/\d+\/export$/) && method === 'GET') {
      const id = parseInt(path.split('/')[3]);
      const data = designSystemQueries.exportDesignSystem(id);

      if (!data) {
        sendJSON(res, { error: 'Design system not found' }, 404);
        return;
      }

      sendJSON(res, data);
      return;
    }

    // POST /api/design-systems/import - Import design system
    if (path === '/api/design-systems/import' && method === 'POST') {
      const body = await parseBody(req);

      try {
        const systemId = designSystemQueries.importDesignSystem(body);
        sendJSON(res, { success: true, systemId }, 201);
      } catch (error) {
        sendJSON(res, { error: 'Invalid design system data' }, 400);
      }

      return;
    }

    // POST /api/design-systems/:id/apply - Apply design system to components
    if (path.match(/^\/api\/design-systems\/\d+\/apply$/) && method === 'POST') {
      const id = parseInt(path.split('/')[3]);
      const system = designSystemQueries.getDesignSystemById(id);

      if (!system) {
        sendJSON(res, { error: 'Design system not found' }, 404);
        return;
      }

      // Set as active
      designSystemQueries.setActiveDesignSystem(id);

      sendJSON(res, { success: true, message: 'Design system applied to all components' });
      return;
    }

    // 404 - Not Found
    sendJSON(res, { error: 'Not Found' }, 404);

  } catch (error) {
    console.error('API Error:', error);
    sendJSON(res, { error: error.message }, 500);
  }
}

// Create server
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📡 Endpoints available at http://localhost:${PORT}/api/...`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down API server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

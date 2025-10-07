/**
 * Component Database Queries
 * All database operations for components
 */

import { withConnection } from '../connection.js';

/**
 * Get all components with optional filters
 * @param {Object} filters - Filter options
 * @returns {Array} List of components
 */
export function getAllComponents(filters = {}) {
  return withConnection((db) => {
    let query = 'SELECT * FROM components WHERE 1=1';
    const params = {};

    if (filters.category) {
      query += ' AND category = @category';
      params.category = filters.category;
    }

    if (filters.tags) {
      query += ' AND tags LIKE @tags';
      params.tags = `%${filters.tags}%`;
    }

    // Sorting
    const sortMap = {
      name: 'name ASC',
      usage: 'usage_count DESC',
      created: 'created_at DESC',
      updated: 'updated_at DESC'
    };
    const sort = sortMap[filters.sort] || 'usage_count DESC';
    query += ` ORDER BY ${sort}`;

    // Pagination
    if (filters.limit) {
      query += ' LIMIT @limit';
      params.limit = filters.limit;
    }

    if (filters.offset) {
      query += ' OFFSET @offset';
      params.offset = filters.offset;
    }

    const stmt = db.prepare(query);
    return stmt.all(params);
  });
}

/**
 * Get component by ID with variants
 * @param {number} id - Component ID
 * @returns {Object|null} Component with variants
 */
export function getComponentById(id) {
  return withConnection((db) => {
    const component = db.prepare('SELECT * FROM components WHERE id = ?').get(id);

    if (!component) return null;

    const variants = db.prepare('SELECT * FROM variants WHERE component_id = ?').all(id);

    return {
      ...component,
      variants
    };
  });
}

/**
 * Get component by name
 * @param {string} name - Component name
 * @returns {Object|null} Component
 */
export function getComponentByName(name) {
  return withConnection((db) => {
    return db.prepare('SELECT * FROM components WHERE name = ?').get(name);
  });
}

/**
 * Search components using full-text search
 * @param {string} query - Search query
 * @param {Object} filters - Additional filters
 * @returns {Array} Search results
 */
export function searchComponents(query, filters = {}) {
  return withConnection((db) => {
    let sql = `
      SELECT c.*, rank
      FROM components c
      JOIN component_search s ON c.id = s.rowid
      WHERE component_search MATCH @query
    `;

    const params = { query };

    if (filters.category) {
      sql += ' AND c.category = @category';
      params.category = filters.category;
    }

    sql += ' ORDER BY rank';

    if (filters.limit) {
      sql += ' LIMIT @limit';
      params.limit = filters.limit;
    }

    const stmt = db.prepare(sql);
    return stmt.all(params);
  });
}

/**
 * Get popular components
 * @param {number} limit - Number of components
 * @returns {Array} Popular components
 */
export function getPopularComponents(limit = 10) {
  return withConnection((db) => {
    return db.prepare(`
      SELECT * FROM components
      ORDER BY usage_count DESC
      LIMIT ?
    `).all(limit);
  });
}

/**
 * Get components by category
 * @param {string} category - Category name
 * @returns {Array} Components in category
 */
export function getComponentsByCategory(category) {
  return withConnection((db) => {
    return db.prepare(`
      SELECT * FROM components
      WHERE category = ?
      ORDER BY usage_count DESC
    `).all(category);
  });
}

/**
 * Get all categories with component counts
 * @returns {Array} Categories with counts
 */
export function getCategoriesWithCounts() {
  return withConnection((db) => {
    return db.prepare(`
      SELECT
        cat.name,
        cat.display_name,
        cat.icon,
        cat.sort_order,
        COUNT(c.id) as component_count
      FROM categories cat
      LEFT JOIN components c ON c.category = cat.name
      GROUP BY cat.name
      ORDER BY cat.sort_order
    `).all();
  });
}

/**
 * Increment component usage count
 * @param {number} id - Component ID
 * @returns {boolean} Success status
 */
export function incrementUsageCount(id) {
  return withConnection((db) => {
    const result = db.prepare(`
      UPDATE components
      SET usage_count = usage_count + 1
      WHERE id = ?
    `).run(id);

    return result.changes > 0;
  });
}

/**
 * Get component variants
 * @param {number} componentId - Component ID
 * @returns {Array} Variants
 */
export function getComponentVariants(componentId) {
  return withConnection((db) => {
    return db.prepare(`
      SELECT * FROM variants
      WHERE component_id = ?
      ORDER BY usage_count DESC
    `).all(componentId);
  });
}

/**
 * Get variant by ID
 * @param {number} id - Variant ID
 * @returns {Object|null} Variant
 */
export function getVariantById(id) {
  return withConnection((db) => {
    return db.prepare('SELECT * FROM variants WHERE id = ?').get(id);
  });
}

/**
 * Increment variant usage count
 * @param {number} id - Variant ID
 * @returns {boolean} Success status
 */
export function incrementVariantUsageCount(id) {
  return withConnection((db) => {
    const result = db.prepare(`
      UPDATE variants
      SET usage_count = usage_count + 1
      WHERE id = ?
    `).run(id);

    return result.changes > 0;
  });
}

/**
 * Create new component
 * @param {Object} component - Component data
 * @returns {number} New component ID
 */
export function createComponent(component) {
  return withConnection((db) => {
    const result = db.prepare(`
      INSERT INTO components (name, category, description, html, css, js, props, tags)
      VALUES (@name, @category, @description, @html, @css, @js, @props, @tags)
    `).run(component);

    return result.lastInsertRowid;
  });
}

/**
 * Update component
 * @param {number} id - Component ID
 * @param {Object} updates - Updates to apply
 * @returns {boolean} Success status
 */
export function updateComponent(id, updates) {
  return withConnection((db) => {
    const fields = Object.keys(updates);
    const setClause = fields.map(f => `${f} = @${f}`).join(', ');

    const result = db.prepare(`
      UPDATE components
      SET ${setClause}
      WHERE id = @id
    `).run({ ...updates, id });

    return result.changes > 0;
  });
}

/**
 * Delete component
 * @param {number} id - Component ID
 * @returns {boolean} Success status
 */
export function deleteComponent(id) {
  return withConnection((db) => {
    const result = db.prepare('DELETE FROM components WHERE id = ?').run(id);
    return result.changes > 0;
  });
}

export default {
  getAllComponents,
  getComponentById,
  getComponentByName,
  searchComponents,
  getPopularComponents,
  getComponentsByCategory,
  getCategoriesWithCounts,
  incrementUsageCount,
  getComponentVariants,
  getVariantById,
  incrementVariantUsageCount,
  createComponent,
  updateComponent,
  deleteComponent
};

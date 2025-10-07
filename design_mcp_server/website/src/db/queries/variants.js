/**
 * Variant Queries
 *
 * Manages component variants
 */

import { withConnection } from '../connection.js';

/**
 * Get all variants for a component
 */
export function getComponentVariants(componentId) {
  return withConnection((db) => {
    return db
      .prepare(
        `
      SELECT * FROM variants
      WHERE component_id = ?
      ORDER BY name ASC
    `
      )
      .all(componentId);
  });
}

/**
 * Get variant by ID
 */
export function getVariantById(variantId) {
  return withConnection((db) => {
    return db.prepare('SELECT * FROM variants WHERE id = ?').get(variantId);
  });
}

/**
 * Get variant by name
 */
export function getVariantByName(componentId, variantName) {
  return withConnection((db) => {
    return db
      .prepare(
        `
      SELECT * FROM variants
      WHERE component_id = ? AND name = ?
      COLLATE NOCASE
    `
      )
      .get(componentId, variantName);
  });
}

/**
 * Create new variant
 */
export function createVariant(componentId, name, description = null, overrides = {}) {
  return withConnection((db) => {
    const stmt = db.prepare(`
      INSERT INTO variants (
        component_id,
        name,
        description,
        html_override,
        css_override,
        js_override,
        props
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      componentId,
      name,
      description,
      overrides.html_override || null,
      overrides.css_override || null,
      overrides.js_override || null,
      overrides.props ? JSON.stringify(overrides.props) : null
    );

    return result.lastInsertRowid;
  });
}

/**
 * Update variant
 */
export function updateVariant(variantId, updates) {
  return withConnection((db) => {
    const fields = [];
    const values = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }

    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }

    if (updates.html_override !== undefined) {
      fields.push('html_override = ?');
      values.push(updates.html_override);
    }

    if (updates.css_override !== undefined) {
      fields.push('css_override = ?');
      values.push(updates.css_override);
    }

    if (updates.js_override !== undefined) {
      fields.push('js_override = ?');
      values.push(updates.js_override);
    }

    if (updates.props !== undefined) {
      fields.push('props = ?');
      const propsJson =
        typeof updates.props === 'string'
          ? updates.props
          : JSON.stringify(updates.props);
      values.push(propsJson);
    }

    if (fields.length === 0) {
      return false;
    }

    values.push(variantId);

    const stmt = db.prepare(`
      UPDATE variants
      SET ${fields.join(', ')}
      WHERE id = ?
    `);

    const result = stmt.run(...values);
    return result.changes > 0;
  });
}

/**
 * Delete variant
 */
export function deleteVariant(variantId) {
  return withConnection((db) => {
    const stmt = db.prepare('DELETE FROM variants WHERE id = ?');
    const result = stmt.run(variantId);
    return result.changes > 0;
  });
}

/**
 * Get all variants across all components
 */
export function getAllVariants() {
  return withConnection((db) => {
    return db
      .prepare(
        `
      SELECT
        v.*,
        c.name as component_name,
        c.category as component_category
      FROM variants v
      JOIN components c ON v.component_id = c.id
      ORDER BY c.name, v.name
    `
      )
      .all();
  });
}

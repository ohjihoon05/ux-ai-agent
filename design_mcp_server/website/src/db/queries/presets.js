/**
 * Preset Queries
 *
 * Manages component customization presets
 */

import { withConnection } from '../connection.js';

/**
 * Get all presets for a component
 */
export function getComponentPresets(componentId) {
  return withConnection((db) => {
    return db
      .prepare(
        `
      SELECT p.*, c.name as component_name
      FROM presets p
      JOIN components c ON p.component_id = c.id
      WHERE p.component_id = ?
      ORDER BY p.created_at DESC
    `
      )
      .all(componentId);
  });
}

/**
 * Get preset by ID
 */
export function getPresetById(presetId) {
  return withConnection((db) => {
    return db
      .prepare(
        `
      SELECT p.*, c.name as component_name
      FROM presets p
      JOIN components c ON p.component_id = c.id
      WHERE p.id = ?
    `
      )
      .get(presetId);
  });
}

/**
 * Create new preset
 */
export function createPreset(componentId, name, customization, description = null) {
  return withConnection((db) => {
    const stmt = db.prepare(`
      INSERT INTO presets (component_id, name, description, customization)
      VALUES (?, ?, ?, ?)
    `);

    const customizationJson = typeof customization === 'string'
      ? customization
      : JSON.stringify(customization);

    const result = stmt.run(componentId, name, description, customizationJson);
    return result.lastInsertRowid;
  });
}

/**
 * Update preset
 */
export function updatePreset(presetId, updates) {
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

    if (updates.customization !== undefined) {
      fields.push('customization = ?');
      const customizationJson = typeof updates.customization === 'string'
        ? updates.customization
        : JSON.stringify(updates.customization);
      values.push(customizationJson);
    }

    if (fields.length === 0) {
      return false;
    }

    values.push(presetId);

    const stmt = db.prepare(`
      UPDATE presets
      SET ${fields.join(', ')}
      WHERE id = ?
    `);

    const result = stmt.run(...values);
    return result.changes > 0;
  });
}

/**
 * Delete preset
 */
export function deletePreset(presetId) {
  return withConnection((db) => {
    const stmt = db.prepare('DELETE FROM presets WHERE id = ?');
    const result = stmt.run(presetId);
    return result.changes > 0;
  });
}

/**
 * Get popular presets (most used)
 */
export function getPopularPresets(limit = 10) {
  return withConnection((db) => {
    return db
      .prepare(
        `
      SELECT
        p.*,
        c.name as component_name,
        COUNT(pu.id) as usage_count
      FROM presets p
      JOIN components c ON p.component_id = c.id
      LEFT JOIN preset_usage pu ON p.id = pu.preset_id
      GROUP BY p.id
      ORDER BY usage_count DESC, p.created_at DESC
      LIMIT ?
    `
      )
      .all(limit);
  });
}

/**
 * Track preset usage
 */
export function trackPresetUsage(presetId) {
  return withConnection((db) => {
    const stmt = db.prepare(`
      INSERT INTO preset_usage (preset_id)
      VALUES (?)
    `);

    const result = stmt.run(presetId);
    return result.lastInsertRowid;
  });
}

/**
 * Get preset usage statistics
 */
export function getPresetStats(presetId) {
  return withConnection((db) => {
    return db
      .prepare(
        `
      SELECT
        COUNT(*) as total_uses,
        COUNT(DISTINCT DATE(used_at)) as unique_days,
        MAX(used_at) as last_used
      FROM preset_usage
      WHERE preset_id = ?
    `
      )
      .get(presetId);
  });
}

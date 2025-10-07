/**
 * Preset Usage Queries
 * Track which presets are used with which design systems
 */

import { withConnection } from '../connection.js';

/**
 * Get all preset usages
 */
export function getAllPresetUsages(options = {}) {
  return withConnection((db) => {
    const { limit = 100, offset = 0 } = options;

    const stmt = db.prepare(`
      SELECT
        pu.*,
        p.name as preset_name,
        ds.name as design_system_name
      FROM preset_usage pu
      LEFT JOIN presets p ON pu.preset_id = p.id
      LEFT JOIN design_systems ds ON pu.design_system_id = ds.id
      ORDER BY pu.applied_at DESC
      LIMIT ? OFFSET ?
    `);

    return stmt.all(limit, offset);
  });
}

/**
 * Get preset usages by preset ID
 */
export function getUsagesByPresetId(presetId) {
  return withConnection((db) => {
    const stmt = db.prepare(`
      SELECT
        pu.*,
        ds.name as design_system_name,
        ds.colors,
        ds.typography
      FROM preset_usage pu
      LEFT JOIN design_systems ds ON pu.design_system_id = ds.id
      WHERE pu.preset_id = ?
      ORDER BY pu.applied_at DESC
    `);

    return stmt.all(presetId);
  });
}

/**
 * Get preset usages by design system ID
 */
export function getUsagesByDesignSystemId(designSystemId) {
  return withConnection((db) => {
    const stmt = db.prepare(`
      SELECT
        pu.*,
        p.name as preset_name,
        p.config
      FROM preset_usage pu
      LEFT JOIN presets p ON pu.preset_id = p.id
      WHERE pu.design_system_id = ?
      ORDER BY pu.applied_at DESC
    `);

    return stmt.all(designSystemId);
  });
}

/**
 * Track preset usage
 */
export function trackPresetUsage(presetId, designSystemId) {
  return withConnection((db) => {
    const stmt = db.prepare(`
      INSERT INTO preset_usage (preset_id, design_system_id)
      VALUES (?, ?)
    `);

    const result = stmt.run(presetId, designSystemId);
    return result.lastInsertRowid;
  });
}

/**
 * Get most used presets with design system
 */
export function getMostUsedPresets(designSystemId, limit = 10) {
  return withConnection((db) => {
    const stmt = db.prepare(`
      SELECT
        p.*,
        COUNT(pu.id) as usage_count
      FROM presets p
      LEFT JOIN preset_usage pu ON p.id = pu.preset_id
      WHERE pu.design_system_id = ? OR pu.design_system_id IS NULL
      GROUP BY p.id
      ORDER BY usage_count DESC
      LIMIT ?
    `);

    return stmt.all(designSystemId, limit);
  });
}

/**
 * Get usage statistics
 */
export function getUsageStatistics() {
  return withConnection((db) => {
    const stmt = db.prepare(`
      SELECT
        COUNT(DISTINCT preset_id) as total_presets_used,
        COUNT(DISTINCT design_system_id) as total_design_systems_used,
        COUNT(*) as total_applications
      FROM preset_usage
    `);

    return stmt.get();
  });
}

/**
 * Delete preset usage
 */
export function deletePresetUsage(id) {
  return withConnection((db) => {
    const stmt = db.prepare(`
      DELETE FROM preset_usage WHERE id = ?
    `);

    const result = stmt.run(id);
    return result.changes > 0;
  });
}

/**
 * Delete all usages for a preset
 */
export function deleteUsagesByPresetId(presetId) {
  return withConnection((db) => {
    const stmt = db.prepare(`
      DELETE FROM preset_usage WHERE preset_id = ?
    `);

    const result = stmt.run(presetId);
    return result.changes;
  });
}

/**
 * Delete all usages for a design system
 */
export function deleteUsagesByDesignSystemId(designSystemId) {
  return withConnection((db) => {
    const stmt = db.prepare(`
      DELETE FROM preset_usage WHERE design_system_id = ?
    `);

    const result = stmt.run(designSystemId);
    return result.changes;
  });
}

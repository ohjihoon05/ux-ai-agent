/**
 * Analytics Database Queries
 * Track and query usage analytics
 */

import { withConnection } from '../connection.js';

/**
 * Track analytics event
 * @param {Object} event - Event data
 * @returns {number} Event ID
 */
export function trackEvent(event) {
  return withConnection((db) => {
    const result = db.prepare(`
      INSERT INTO analytics (component_id, variant_id, event_type, metadata, ip_hash)
      VALUES (@component_id, @variant_id, @event_type, @metadata, @ip_hash)
    `).run({
      component_id: event.component_id || null,
      variant_id: event.variant_id || null,
      event_type: event.event_type,
      metadata: event.metadata ? JSON.stringify(event.metadata) : null,
      ip_hash: event.ip_hash || null
    });

    return result.lastInsertRowid;
  });
}

/**
 * Get analytics for component
 * @param {number} componentId - Component ID
 * @param {Object} filters - Filter options
 * @returns {Array} Analytics events
 */
export function getComponentAnalytics(componentId, filters = {}) {
  return withConnection((db) => {
    let query = 'SELECT * FROM analytics WHERE component_id = @component_id';
    const params = { component_id: componentId };

    if (filters.event_type) {
      query += ' AND event_type = @event_type';
      params.event_type = filters.event_type;
    }

    if (filters.startDate) {
      query += ' AND timestamp >= @start_date';
      params.start_date = filters.startDate;
    }

    if (filters.endDate) {
      query += ' AND timestamp <= @end_date';
      params.end_date = filters.endDate;
    }

    query += ' ORDER BY timestamp DESC';

    if (filters.limit) {
      query += ' LIMIT @limit';
      params.limit = filters.limit;
    }

    return db.prepare(query).all(params);
  });
}

/**
 * Get popular components by time period
 * @param {string} period - Time period (day, week, month, all)
 * @param {number} limit - Number of components
 * @returns {Array} Popular components with stats
 */
export function getPopularComponentsByPeriod(period = 'week', limit = 10) {
  return withConnection((db) => {
    const periodMap = {
      day: "datetime('now', '-1 day')",
      week: "datetime('now', '-7 days')",
      month: "datetime('now', '-30 days')",
      all: "datetime('1970-01-01')"
    };

    const startDate = periodMap[period] || periodMap.week;

    return db.prepare(`
      SELECT
        c.*,
        COUNT(CASE WHEN a.event_type = 'copy' THEN 1 END) as copy_count,
        COUNT(CASE WHEN a.event_type = 'preview' THEN 1 END) as preview_count,
        COUNT(CASE WHEN a.event_type = 'view' THEN 1 END) as view_count,
        COUNT(*) as total_events
      FROM components c
      LEFT JOIN analytics a ON a.component_id = c.id
        AND a.timestamp >= ${startDate}
      GROUP BY c.id
      ORDER BY copy_count DESC, preview_count DESC
      LIMIT ?
    `).all(limit);
  });
}

/**
 * Get event count by type
 * @param {string} eventType - Event type
 * @param {Object} filters - Filter options
 * @returns {number} Event count
 */
export function getEventCount(eventType, filters = {}) {
  return withConnection((db) => {
    let query = 'SELECT COUNT(*) as count FROM analytics WHERE event_type = @event_type';
    const params = { event_type: eventType };

    if (filters.component_id) {
      query += ' AND component_id = @component_id';
      params.component_id = filters.component_id;
    }

    if (filters.startDate) {
      query += ' AND timestamp >= @start_date';
      params.start_date = filters.startDate;
    }

    if (filters.endDate) {
      query += ' AND timestamp <= @end_date';
      params.end_date = filters.endDate;
    }

    const result = db.prepare(query).get(params);
    return result.count;
  });
}

/**
 * Get analytics summary
 * @returns {Object} Analytics summary
 */
export function getAnalyticsSummary() {
  return withConnection((db) => {
    return {
      totalEvents: db.prepare('SELECT COUNT(*) as count FROM analytics').get().count,
      totalCopies: db.prepare("SELECT COUNT(*) as count FROM analytics WHERE event_type = 'copy'").get().count,
      totalPreviews: db.prepare("SELECT COUNT(*) as count FROM analytics WHERE event_type = 'preview'").get().count,
      totalViews: db.prepare("SELECT COUNT(*) as count FROM analytics WHERE event_type = 'view'").get().count,
      totalSearches: db.prepare("SELECT COUNT(*) as count FROM analytics WHERE event_type = 'search'").get().count,
      uniqueComponents: db.prepare('SELECT COUNT(DISTINCT component_id) as count FROM analytics WHERE component_id IS NOT NULL').get().count
    };
  });
}

/**
 * Get search queries
 * @param {number} limit - Number of queries
 * @returns {Array} Search queries with counts
 */
export function getSearchQueries(limit = 20) {
  return withConnection((db) => {
    return db.prepare(`
      SELECT
        json_extract(metadata, '$.query') as query,
        COUNT(*) as count
      FROM analytics
      WHERE event_type = 'search'
        AND metadata IS NOT NULL
      GROUP BY query
      ORDER BY count DESC
      LIMIT ?
    `).all(limit);
  });
}

/**
 * Track component copy
 * @param {number} componentId - Component ID
 * @param {number} variantId - Variant ID (optional)
 * @param {Object} metadata - Additional metadata
 * @returns {number} Event ID
 */
export function trackCopy(componentId, variantId = null, metadata = {}) {
  return trackEvent({
    component_id: componentId,
    variant_id: variantId,
    event_type: 'copy',
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Track component preview
 * @param {number} componentId - Component ID
 * @param {Object} metadata - Additional metadata
 * @returns {number} Event ID
 */
export function trackPreview(componentId, metadata = {}) {
  return trackEvent({
    component_id: componentId,
    event_type: 'preview',
    metadata
  });
}

/**
 * Track search
 * @param {string} query - Search query
 * @param {number} resultCount - Number of results
 * @returns {number} Event ID
 */
export function trackSearch(query, resultCount = 0) {
  return trackEvent({
    event_type: 'search',
    metadata: {
      query,
      result_count: resultCount,
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Clean old analytics data
 * @param {number} daysToKeep - Days of data to keep
 * @returns {number} Number of deleted records
 */
export function cleanOldAnalytics(daysToKeep = 90) {
  return withConnection((db) => {
    const result = db.prepare(`
      DELETE FROM analytics
      WHERE timestamp < datetime('now', '-${daysToKeep} days')
    `).run();

    return result.changes;
  });
}

export default {
  trackEvent,
  getComponentAnalytics,
  getPopularComponentsByPeriod,
  getEventCount,
  getAnalyticsSummary,
  getSearchQueries,
  trackCopy,
  trackPreview,
  trackSearch,
  cleanOldAnalytics
};

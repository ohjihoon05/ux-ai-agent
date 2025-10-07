-- Database Optimization
-- Additional indexes and performance improvements

-- Component search optimization
CREATE INDEX IF NOT EXISTS idx_components_name_category ON components(name, category);
CREATE INDEX IF NOT EXISTS idx_components_tags ON components(tags);

-- Analytics time-range queries
CREATE INDEX IF NOT EXISTS idx_analytics_component_timestamp ON analytics(component_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_event_timestamp ON analytics(event_type, timestamp DESC);

-- Variant lookups
CREATE INDEX IF NOT EXISTS idx_variants_component_name ON variants(component_id, name);

-- Preset searches
CREATE INDEX IF NOT EXISTS idx_presets_component ON presets(component_id);
CREATE INDEX IF NOT EXISTS idx_presets_usage ON presets(usage_count DESC);

-- Design system active lookup
-- Already created in schema.sql: idx_design_systems_active

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_components_category_usage ON components(category, usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_daily ON analytics(date(timestamp), event_type);

-- Analyze tables for query planner
ANALYZE components;
ANALYZE variants;
ANALYZE presets;
ANALYZE analytics;
ANALYZE design_systems;

-- Vacuum to reclaim space and optimize
VACUUM;

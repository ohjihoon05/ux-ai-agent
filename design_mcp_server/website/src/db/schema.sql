-- Component Library Database Schema
-- SQLite 3.x

-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- Schema version tracking
CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories for component organization
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Core component definitions
CREATE TABLE IF NOT EXISTS components (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  html TEXT NOT NULL,
  css TEXT NOT NULL,
  js TEXT,
  props TEXT DEFAULT '{}',  -- JSON format
  tags TEXT,  -- Comma-separated
  preview_image BLOB,
  usage_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category) REFERENCES categories(name) ON UPDATE CASCADE
);

-- Component variants (style variations)
CREATE TABLE IF NOT EXISTS variants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  component_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  css_overrides TEXT,
  props_overrides TEXT DEFAULT '{}',  -- JSON format
  preview_image BLOB,
  usage_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (component_id) REFERENCES components(id) ON DELETE CASCADE,
  UNIQUE (component_id, name)
);

-- Design systems for brand customization
CREATE TABLE IF NOT EXISTS design_systems (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  colors TEXT NOT NULL,  -- JSON format
  typography TEXT,  -- JSON format
  spacing TEXT,  -- JSON format
  borders TEXT,  -- JSON format
  shadows TEXT,  -- JSON format
  breakpoints TEXT,  -- JSON format
  css_variables TEXT,
  is_active BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User presets for customization
CREATE TABLE IF NOT EXISTS presets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  config TEXT NOT NULL,  -- JSON format
  applicable_components TEXT,  -- JSON array of component IDs
  thumbnail BLOB,
  usage_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Usage analytics tracking
CREATE TABLE IF NOT EXISTS analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  component_id INTEGER,
  variant_id INTEGER,
  event_type TEXT NOT NULL CHECK(event_type IN ('view', 'preview', 'copy', 'customize', 'search')),
  metadata TEXT,  -- JSON format
  ip_hash TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (component_id) REFERENCES components(id) ON DELETE SET NULL,
  FOREIGN KEY (variant_id) REFERENCES variants(id) ON DELETE SET NULL
);

-- Preset usage tracking (junction table)
CREATE TABLE IF NOT EXISTS preset_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  preset_id INTEGER NOT NULL,
  design_system_id INTEGER NOT NULL,
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (preset_id) REFERENCES presets(id) ON DELETE CASCADE,
  FOREIGN KEY (design_system_id) REFERENCES design_systems(id) ON DELETE CASCADE
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_components_category ON components(category);
CREATE INDEX IF NOT EXISTS idx_components_usage ON components(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_components_created ON components(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_variants_component ON variants(component_id);
CREATE INDEX IF NOT EXISTS idx_variants_usage ON variants(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_component ON analytics(component_id);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);

-- Unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS idx_components_name ON components(name);
CREATE UNIQUE INDEX IF NOT EXISTS idx_variants_name_component ON variants(component_id, name);
CREATE UNIQUE INDEX IF NOT EXISTS idx_design_systems_active ON design_systems(is_active) WHERE is_active = 1;

-- Full-text search for components
CREATE VIRTUAL TABLE IF NOT EXISTS component_search USING fts5(
  name,
  category,
  tags,
  description,
  content=components,
  content_rowid=id
);

-- Triggers to keep FTS index updated
CREATE TRIGGER IF NOT EXISTS component_search_insert AFTER INSERT ON components BEGIN
  INSERT INTO component_search(rowid, name, category, tags, description)
  VALUES (new.id, new.name, new.category, new.tags, new.description);
END;

CREATE TRIGGER IF NOT EXISTS component_search_delete AFTER DELETE ON components BEGIN
  DELETE FROM component_search WHERE rowid = old.id;
END;

CREATE TRIGGER IF NOT EXISTS component_search_update AFTER UPDATE ON components BEGIN
  UPDATE component_search SET
    name = new.name,
    category = new.category,
    tags = new.tags,
    description = new.description
  WHERE rowid = new.id;
END;

-- Trigger to update component updated_at timestamp
CREATE TRIGGER IF NOT EXISTS components_updated_at AFTER UPDATE ON components BEGIN
  UPDATE components SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to update design_systems updated_at timestamp
CREATE TRIGGER IF NOT EXISTS design_systems_updated_at AFTER UPDATE ON design_systems BEGIN
  UPDATE design_systems SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Insert initial schema version
INSERT OR IGNORE INTO schema_migrations (version) VALUES (1);

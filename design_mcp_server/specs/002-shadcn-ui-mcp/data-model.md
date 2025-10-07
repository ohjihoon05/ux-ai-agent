# Data Model: Component Library Website with MCP Integration

**Date**: 2025-10-07
**Storage**: SQLite database (local file-based)

## Entity Relationship Diagram

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Component  │────<│   Variant    │     │   Preset    │
└─────────────┘     └──────────────┘     └─────────────┘
       │                                        │
       │                                        │
       ▼                                        ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Analytics  │     │ DesignSystem │────<│ PresetUsage │
└─────────────┘     └──────────────┘     └─────────────┘
```

## Core Entities

### 1. Component

**Purpose**: Stores UI component definitions with their HTML, CSS, and JavaScript code

**Attributes**:
- `id` (INTEGER, PK): Unique identifier
- `name` (TEXT, UNIQUE): Component name (e.g., "GlassButton", "HeroSection")
- `category` (TEXT): Component category (e.g., "buttons", "cards", "navigation")
- `description` (TEXT): Human-readable description
- `html` (TEXT): HTML template with placeholders (e.g., {{title}})
- `css` (TEXT): CSS/TailwindCSS styles
- `js` (TEXT, NULLABLE): Optional JavaScript for interactivity
- `props` (JSON): Default property values
- `tags` (TEXT): Comma-separated tags for search
- `preview_image` (BLOB, NULLABLE): Thumbnail image data
- `usage_count` (INTEGER): Number of times copied
- `created_at` (DATETIME): Creation timestamp
- `updated_at` (DATETIME): Last modification timestamp

**Relationships**:
- Has many Variants (1:N)
- Has many Analytics events (1:N)

**Validation Rules**:
- Name must be unique and non-empty
- Category must be from predefined list
- HTML template must be valid
- Props must be valid JSON

**State Transitions**: None (immutable after creation, only usage_count updates)

### 2. Variant

**Purpose**: Stores style variations of components (e.g., primary, secondary, ghost)

**Attributes**:
- `id` (INTEGER, PK): Unique identifier
- `component_id` (INTEGER, FK): Parent component reference
- `name` (TEXT): Variant name (e.g., "primary", "outline")
- `description` (TEXT): Variant description
- `css_overrides` (TEXT): Additional/override CSS
- `props_overrides` (JSON): Override default props
- `preview_image` (BLOB, NULLABLE): Variant thumbnail
- `usage_count` (INTEGER): Times this variant was copied
- `created_at` (DATETIME): Creation timestamp

**Relationships**:
- Belongs to Component (N:1)

**Validation Rules**:
- Name must be unique within component
- CSS overrides must be valid CSS
- Props overrides must be valid JSON

### 3. DesignSystem

**Purpose**: Stores organization-wide design tokens and settings

**Attributes**:
- `id` (INTEGER, PK): Unique identifier
- `name` (TEXT, UNIQUE): Design system name
- `description` (TEXT): Description
- `colors` (JSON): Color palette (primary, secondary, accent, etc.)
- `typography` (JSON): Font families, sizes, weights
- `spacing` (JSON): Spacing scale (4px, 8px, 16px, etc.)
- `borders` (JSON): Border radii, widths
- `shadows` (JSON): Box shadow definitions
- `breakpoints` (JSON): Responsive breakpoints
- `css_variables` (TEXT): Generated CSS custom properties
- `is_active` (BOOLEAN): Currently active system
- `created_at` (DATETIME): Creation timestamp
- `updated_at` (DATETIME): Last modification

**Relationships**:
- Has many PresetUsages (1:N)

**Validation Rules**:
- Only one design system can be active
- Color values must be valid hex/rgb/hsl
- Typography must include required keys (body, heading)

**State Transitions**:
- Draft → Active (when applied)
- Active → Inactive (when replaced)

### 4. Preset

**Purpose**: User-saved customization settings for components

**Attributes**:
- `id` (INTEGER, PK): Unique identifier
- `name` (TEXT): Preset name
- `description` (TEXT): Description
- `config` (JSON): Customization settings
  - `colors`: Color overrides
  - `sizes`: Size adjustments
  - `spacing`: Spacing modifications
  - `animations`: Animation settings
- `applicable_components` (JSON): List of component IDs
- `thumbnail` (BLOB, NULLABLE): Preview image
- `usage_count` (INTEGER): Times applied
- `created_at` (DATETIME): Creation timestamp
- `updated_at` (DATETIME): Last modification

**Relationships**:
- Has many PresetUsages (1:N)

**Validation Rules**:
- Name must be non-empty
- Config must be valid JSON
- Applicable components must exist

### 5. Analytics

**Purpose**: Tracks component usage and user interactions

**Attributes**:
- `id` (INTEGER, PK): Unique identifier
- `component_id` (INTEGER, FK, NULLABLE): Related component
- `variant_id` (INTEGER, FK, NULLABLE): Related variant
- `event_type` (TEXT): Event type
  - "copy": Component code copied
  - "preview": Component previewed
  - "customize": Customization applied
  - "search": Search performed
  - "download": Design tokens exported
- `metadata` (JSON): Additional event data
  - `user_agent`: Browser information
  - `session_id`: Session identifier
  - `search_query`: For search events
  - `customizations`: For customize events
- `timestamp` (DATETIME): Event timestamp
- `ip_hash` (TEXT, NULLABLE): Hashed IP for unique users

**Relationships**:
- Belongs to Component (N:1, optional)
- Belongs to Variant (N:1, optional)

**Validation Rules**:
- Event type must be from predefined list
- Metadata must be valid JSON
- Timestamp must be valid datetime

### 6. PresetUsage

**Purpose**: Junction table linking presets to design systems

**Attributes**:
- `id` (INTEGER, PK): Unique identifier
- `preset_id` (INTEGER, FK): Preset reference
- `design_system_id` (INTEGER, FK): Design system reference
- `applied_at` (DATETIME): Application timestamp

**Relationships**:
- Belongs to Preset (N:1)
- Belongs to DesignSystem (N:1)

## Supporting Tables

### 7. ComponentSearch (Virtual Table)

**Purpose**: Full-text search index for components

**Attributes**:
- `name` (TEXT): Component name
- `category` (TEXT): Component category
- `tags` (TEXT): Search tags
- `description` (TEXT): Component description

**Implementation**:
```sql
CREATE VIRTUAL TABLE component_search USING fts5(
  name, category, tags, description,
  content=components,
  content_rowid=id
);
```

### 8. Categories

**Purpose**: Predefined component categories

**Attributes**:
- `id` (INTEGER, PK): Unique identifier
- `name` (TEXT, UNIQUE): Category name
- `display_name` (TEXT): UI display name
- `icon` (TEXT): Icon identifier
- `sort_order` (INTEGER): Display order

**Static Data**:
- buttons
- cards
- forms
- navigation
- modals
- tables
- layouts
- feedback

## Database Indexes

```sql
-- Performance indexes
CREATE INDEX idx_components_category ON components(category);
CREATE INDEX idx_components_usage ON components(usage_count DESC);
CREATE INDEX idx_variants_component ON variants(component_id);
CREATE INDEX idx_analytics_component ON analytics(component_id);
CREATE INDEX idx_analytics_timestamp ON analytics(timestamp DESC);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);

-- Unique constraints
CREATE UNIQUE INDEX idx_components_name ON components(name);
CREATE UNIQUE INDEX idx_variants_name_component ON variants(component_id, name);
CREATE UNIQUE INDEX idx_design_systems_active ON design_systems(is_active) WHERE is_active = 1;
```

## Data Migration Strategy

### Initial Seed Data

1. **Components**: 50+ pre-built components across all categories
2. **Variants**: 3-5 variants per component
3. **Categories**: 8 main categories
4. **Default Design System**: Base TailwindCSS configuration

### Migration Scripts

```sql
-- V1: Initial schema
CREATE TABLE schema_migrations (
  version INTEGER PRIMARY KEY,
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- V2: Add preview images
ALTER TABLE components ADD COLUMN preview_image BLOB;
ALTER TABLE variants ADD COLUMN preview_image BLOB;

-- V3: Add design systems
CREATE TABLE design_systems (...);
CREATE TABLE preset_usages (...);
```

## Access Patterns

### Common Queries

1. **List components by category**:
```sql
SELECT * FROM components
WHERE category = ?
ORDER BY usage_count DESC;
```

2. **Search components**:
```sql
SELECT c.* FROM components c
JOIN component_search s ON c.id = s.rowid
WHERE component_search MATCH ?
ORDER BY rank;
```

3. **Get component with variants**:
```sql
SELECT c.*, v.* FROM components c
LEFT JOIN variants v ON v.component_id = c.id
WHERE c.id = ?;
```

4. **Track usage**:
```sql
INSERT INTO analytics (component_id, event_type, metadata)
VALUES (?, 'copy', ?);

UPDATE components
SET usage_count = usage_count + 1
WHERE id = ?;
```

5. **Popular components**:
```sql
SELECT * FROM components
ORDER BY usage_count DESC
LIMIT 10;
```

## Performance Considerations

- SQLite Write-Ahead Logging (WAL) mode for concurrent reads
- Prepared statements for all queries
- Connection pooling in MCP server (max 5 connections)
- Periodic VACUUM for database optimization
- Analytics aggregation via batch processing

## Security Considerations

- No user authentication required (public library)
- IP hashing for privacy-preserving analytics
- SQL injection prevention via parameterized queries
- XSS prevention in component templates
- Content Security Policy for preview isolation

## Backup Strategy

- Daily SQLite database file backup
- Export/import functionality for design systems
- Component version history (future enhancement)
- Transaction log for critical operations
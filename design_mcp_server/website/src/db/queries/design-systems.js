/**
 * Design System Queries
 * Manage brand design systems (colors, typography, spacing, etc.)
 */

import { withConnection } from '../connection.js';

/**
 * Get all design systems
 */
export function getAllDesignSystems() {
  return withConnection((db) => {
    const stmt = db.prepare(`
      SELECT * FROM design_systems
      ORDER BY is_active DESC, created_at DESC
    `);
    return stmt.all();
  });
}

/**
 * Get design system by ID
 */
export function getDesignSystemById(id) {
  return withConnection((db) => {
    const stmt = db.prepare(`
      SELECT * FROM design_systems WHERE id = ?
    `);
    return stmt.get(id);
  });
}

/**
 * Get active design system
 */
export function getActiveDesignSystem() {
  return withConnection((db) => {
    const stmt = db.prepare(`
      SELECT * FROM design_systems WHERE is_active = 1 LIMIT 1
    `);
    return stmt.get();
  });
}

/**
 * Get design system by name
 */
export function getDesignSystemByName(name) {
  return withConnection((db) => {
    const stmt = db.prepare(`
      SELECT * FROM design_systems WHERE name = ?
    `);
    return stmt.get(name);
  });
}

/**
 * Create design system
 * @param {Object} data - Design system data
 * @param {string} data.name - System name
 * @param {string} data.description - Description
 * @param {Object} data.colors - Color palette
 * @param {Object} data.typography - Typography settings
 * @param {Object} data.spacing - Spacing scale
 * @param {Object} data.borders - Border settings
 * @param {Object} data.shadows - Shadow settings
 * @param {Object} data.breakpoints - Responsive breakpoints
 * @param {string} data.css_variables - Generated CSS variables
 * @param {boolean} data.is_active - Set as active system
 */
export function createDesignSystem(data) {
  return withConnection((db) => {
    // If setting as active, deactivate all others first
    if (data.is_active) {
      const deactivateStmt = db.prepare(`
        UPDATE design_systems SET is_active = 0
      `);
      deactivateStmt.run();
    }

    const stmt = db.prepare(`
      INSERT INTO design_systems (
        name, description, colors, typography, spacing,
        borders, shadows, breakpoints, css_variables, is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.name,
      data.description || null,
      JSON.stringify(data.colors),
      data.typography ? JSON.stringify(data.typography) : null,
      data.spacing ? JSON.stringify(data.spacing) : null,
      data.borders ? JSON.stringify(data.borders) : null,
      data.shadows ? JSON.stringify(data.shadows) : null,
      data.breakpoints ? JSON.stringify(data.breakpoints) : null,
      data.css_variables || null,
      data.is_active ? 1 : 0
    );

    return result.lastInsertRowid;
  });
}

/**
 * Update design system
 */
export function updateDesignSystem(id, updates) {
  return withConnection((db) => {
    // If setting as active, deactivate all others first
    if (updates.is_active) {
      const deactivateStmt = db.prepare(`
        UPDATE design_systems SET is_active = 0 WHERE id != ?
      `);
      deactivateStmt.run(id);
    }

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
    if (updates.colors !== undefined) {
      fields.push('colors = ?');
      values.push(JSON.stringify(updates.colors));
    }
    if (updates.typography !== undefined) {
      fields.push('typography = ?');
      values.push(JSON.stringify(updates.typography));
    }
    if (updates.spacing !== undefined) {
      fields.push('spacing = ?');
      values.push(JSON.stringify(updates.spacing));
    }
    if (updates.borders !== undefined) {
      fields.push('borders = ?');
      values.push(JSON.stringify(updates.borders));
    }
    if (updates.shadows !== undefined) {
      fields.push('shadows = ?');
      values.push(JSON.stringify(updates.shadows));
    }
    if (updates.breakpoints !== undefined) {
      fields.push('breakpoints = ?');
      values.push(JSON.stringify(updates.breakpoints));
    }
    if (updates.css_variables !== undefined) {
      fields.push('css_variables = ?');
      values.push(updates.css_variables);
    }
    if (updates.is_active !== undefined) {
      fields.push('is_active = ?');
      values.push(updates.is_active ? 1 : 0);
    }

    if (fields.length === 0) {
      return false;
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`
      UPDATE design_systems
      SET ${fields.join(', ')}
      WHERE id = ?
    `);

    const result = stmt.run(...values);
    return result.changes > 0;
  });
}

/**
 * Delete design system
 */
export function deleteDesignSystem(id) {
  return withConnection((db) => {
    const stmt = db.prepare(`
      DELETE FROM design_systems WHERE id = ?
    `);
    const result = stmt.run(id);
    return result.changes > 0;
  });
}

/**
 * Set active design system
 */
export function setActiveDesignSystem(id) {
  return withConnection((db) => {
    // Deactivate all
    const deactivateStmt = db.prepare(`
      UPDATE design_systems SET is_active = 0
    `);
    deactivateStmt.run();

    // Activate selected
    const activateStmt = db.prepare(`
      UPDATE design_systems SET is_active = 1 WHERE id = ?
    `);
    const result = activateStmt.run(id);
    return result.changes > 0;
  });
}

/**
 * Generate CSS variables from design system
 */
export function generateCSSVariables(designSystem) {
  const lines = [':root {'];

  // Colors
  if (designSystem.colors) {
    const colors = typeof designSystem.colors === 'string'
      ? JSON.parse(designSystem.colors)
      : designSystem.colors;

    Object.entries(colors).forEach(([key, value]) => {
      lines.push(`  --color-${key}: ${value};`);
    });
  }

  // Typography
  if (designSystem.typography) {
    const typography = typeof designSystem.typography === 'string'
      ? JSON.parse(designSystem.typography)
      : designSystem.typography;

    if (typography.fontFamily) {
      lines.push(`  --font-family: ${typography.fontFamily};`);
    }
    if (typography.fontSizes) {
      Object.entries(typography.fontSizes).forEach(([key, value]) => {
        lines.push(`  --font-size-${key}: ${value};`);
      });
    }
    if (typography.lineHeights) {
      Object.entries(typography.lineHeights).forEach(([key, value]) => {
        lines.push(`  --line-height-${key}: ${value};`);
      });
    }
  }

  // Spacing
  if (designSystem.spacing) {
    const spacing = typeof designSystem.spacing === 'string'
      ? JSON.parse(designSystem.spacing)
      : designSystem.spacing;

    Object.entries(spacing).forEach(([key, value]) => {
      lines.push(`  --spacing-${key}: ${value};`);
    });
  }

  // Borders
  if (designSystem.borders) {
    const borders = typeof designSystem.borders === 'string'
      ? JSON.parse(designSystem.borders)
      : designSystem.borders;

    if (borders.radius) {
      Object.entries(borders.radius).forEach(([key, value]) => {
        lines.push(`  --border-radius-${key}: ${value};`);
      });
    }
    if (borders.width) {
      Object.entries(borders.width).forEach(([key, value]) => {
        lines.push(`  --border-width-${key}: ${value};`);
      });
    }
  }

  // Shadows
  if (designSystem.shadows) {
    const shadows = typeof designSystem.shadows === 'string'
      ? JSON.parse(designSystem.shadows)
      : designSystem.shadows;

    Object.entries(shadows).forEach(([key, value]) => {
      lines.push(`  --shadow-${key}: ${value};`);
    });
  }

  lines.push('}');

  return lines.join('\n');
}

/**
 * Export design system as JSON
 */
export function exportDesignSystem(id) {
  const designSystem = getDesignSystemById(id);

  if (!designSystem) {
    return null;
  }

  return {
    name: designSystem.name,
    description: designSystem.description,
    colors: JSON.parse(designSystem.colors),
    typography: designSystem.typography ? JSON.parse(designSystem.typography) : null,
    spacing: designSystem.spacing ? JSON.parse(designSystem.spacing) : null,
    borders: designSystem.borders ? JSON.parse(designSystem.borders) : null,
    shadows: designSystem.shadows ? JSON.parse(designSystem.shadows) : null,
    breakpoints: designSystem.breakpoints ? JSON.parse(designSystem.breakpoints) : null,
    version: '1.0.0',
    exportedAt: new Date().toISOString()
  };
}

/**
 * Import design system from JSON
 */
export function importDesignSystem(data) {
  const designSystemData = {
    name: data.name,
    description: data.description,
    colors: data.colors,
    typography: data.typography,
    spacing: data.spacing,
    borders: data.borders,
    shadows: data.shadows,
    breakpoints: data.breakpoints,
    is_active: false
  };

  // Generate CSS variables
  designSystemData.css_variables = generateCSSVariables(designSystemData);

  return createDesignSystem(designSystemData);
}

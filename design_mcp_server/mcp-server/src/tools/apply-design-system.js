/**
 * Apply Design System Tool
 *
 * Applies a design system (brand colors, fonts, spacing) to component code
 */

import { query, queryOne } from '../db/connection.js';
import { validateRequired, validateString, validateObject } from '../lib/validation.js';
import { logger } from '../lib/logger.js';

/**
 * Tool definition for MCP
 */
export const applyDesignSystemTool = {
  definition: {
    name: 'apply-design-system',
    description:
      'Apply a company design system to component code. Updates colors, fonts, and spacing to match brand guidelines.',
    inputSchema: {
      type: 'object',
      properties: {
        componentCode: {
          type: 'string',
          description: 'The HTML/CSS/JS code from generate-component to customize',
        },
        designSystem: {
          type: 'object',
          description: 'Design system configuration',
          properties: {
            name: {
              type: 'string',
              description: 'Design system name (optional - will search saved systems)',
            },
            colors: {
              type: 'object',
              description:
                'Brand colors: {primary, secondary, accent, background, text}. Optional if using saved system.',
            },
            fonts: {
              type: 'object',
              description:
                'Typography: {heading, body, size}. Optional if using saved system.',
            },
            spacing: {
              type: 'object',
              description: 'Spacing scale: {unit, scale}. Optional if using saved system.',
            },
          },
        },
      },
      required: ['componentCode', 'designSystem'],
    },
  },

  /**
   * Tool handler
   */
  async handler(args) {
    try {
      // Validate inputs
      validateRequired(args, ['componentCode', 'designSystem']);
      const componentCode = validateString(args.componentCode, 'Component code');
      const designSystemInput = validateObject(args.designSystem, 'Design system');

      logger.debug('Applying design system', { designSystem: designSystemInput });

      let designSystem = designSystemInput;

      // If design system name provided, try to load from database
      if (designSystemInput.name) {
        const savedSystem = queryOne(
          `SELECT * FROM design_systems WHERE name = ? COLLATE NOCASE`,
          [designSystemInput.name]
        );

        if (savedSystem) {
          // Parse saved system JSON
          const savedConfig = JSON.parse(savedSystem.config);
          // Merge with provided config (provided config takes precedence)
          designSystem = {
            ...savedConfig,
            ...designSystemInput,
          };
          logger.info(`Loaded saved design system: ${savedSystem.name}`);
        }
      }

      // Extract colors
      const colors = designSystem.colors || {};
      const fonts = designSystem.fonts || {};
      const spacing = designSystem.spacing || {};

      // Apply color replacements
      let customizedCode = componentCode;

      // Color mappings (from default glassmorphism colors to custom)
      const colorReplacements = {
        // Primary purple gradient
        '#667eea': colors.primary || '#667eea',
        '#764ba2': colors.secondary || '#764ba2',
        // Secondary pink gradient
        '#f093fb': colors.accent || '#f093fb',
        '#f5576c': colors.accent || '#f5576c',
        // Background colors
        'rgba(255, 255, 255, 0.15)': colors.background
          ? `${colors.background}15`
          : 'rgba(255, 255, 255, 0.15)',
        'rgba(255, 255, 255, 0.25)': colors.background
          ? `${colors.background}25`
          : 'rgba(255, 255, 255, 0.25)',
        // Text colors
        '#333': colors.text || '#333',
        '#666': colors.textSecondary || '#666',
      };

      // Apply color replacements
      for (const [oldColor, newColor] of Object.entries(colorReplacements)) {
        customizedCode = customizedCode.replaceAll(oldColor, newColor);
      }

      // Apply font replacements
      if (fonts.heading) {
        customizedCode = customizedCode.replace(
          /font-family:\s*['"]?-apple-system[^;]+;/gi,
          `font-family: '${fonts.heading}', -apple-system, BlinkMacSystemFont, sans-serif;`
        );
      }

      if (fonts.size) {
        // Scale font sizes proportionally
        const sizeMultiplier = parseFloat(fonts.size) || 1;
        if (sizeMultiplier !== 1) {
          customizedCode = customizedCode.replace(
            /font-size:\s*(\d+(?:\.\d+)?)px;/gi,
            (match, size) => {
              const newSize = (parseFloat(size) * sizeMultiplier).toFixed(1);
              return `font-size: ${newSize}px;`;
            }
          );
        }
      }

      // Apply spacing replacements
      if (spacing.unit && spacing.scale) {
        const unit = spacing.unit; // e.g., 'px', 'rem'
        const scale = parseFloat(spacing.scale) || 1;

        // Adjust padding/margin
        customizedCode = customizedCode.replace(
          /(padding|margin):\s*(\d+(?:\.\d+)?)px/gi,
          (match, property, size) => {
            const newSize = (parseFloat(size) * scale).toFixed(1);
            return `${property}: ${newSize}${unit}`;
          }
        );
      }

      // Count changes made
      const changes = [];
      if (colors.primary || colors.secondary || colors.accent) {
        changes.push('colors');
      }
      if (fonts.heading || fonts.size) {
        changes.push('typography');
      }
      if (spacing.unit || spacing.scale) {
        changes.push('spacing');
      }

      return {
        content: [
          {
            type: 'text',
            text: `# Design System Applied

${designSystem.name ? `**System**: ${designSystem.name}\n` : ''}**Changes**: ${
              changes.length > 0 ? changes.join(', ') : 'none'
            }

## Customized Code

\`\`\`html
${customizedCode}
\`\`\`

## Design Tokens Applied

${
  Object.keys(colors).length > 0
    ? `### Colors
${Object.entries(colors)
  .map(([key, value]) => `- **${key}**: ${value}`)
  .join('\n')}
`
    : ''
}

${
  Object.keys(fonts).length > 0
    ? `### Typography
${Object.entries(fonts)
  .map(([key, value]) => `- **${key}**: ${value}`)
  .join('\n')}
`
    : ''
}

${
  Object.keys(spacing).length > 0
    ? `### Spacing
${Object.entries(spacing)
  .map(([key, value]) => `- **${key}**: ${value}`)
  .join('\n')}
`
    : ''
}

## Next Steps

Copy the customized code above into your project. The design system has been applied consistently across all styles.
`,
          },
        ],
      };
    } catch (error) {
      logger.error('apply-design-system error', { error: error.message });
      throw error;
    }
  },
};

/**
 * Generate Component Tool
 *
 * Finds and generates component code with customization
 */

import { query, queryOne } from '../db/connection.js';
import { validateRequired, validateString, validateObject } from '../lib/validation.js';
import { generateStandaloneCode } from '../lib/template-engine.js';
import { logger } from '../lib/logger.js';

/**
 * Tool definition for MCP
 */
export const generateComponentTool = {
  definition: {
    name: 'generate-component',
    description:
      'Generate a UI component from the library with optional customization. Returns ready-to-use HTML/CSS/JS code.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the component (e.g., "GlassButton", "ProductCard")',
        },
        variant: {
          type: 'string',
          description:
            'Variant name (e.g., "primary", "secondary", "ghost"). Optional.',
        },
        props: {
          type: 'object',
          description:
            'Custom properties to override defaults (e.g., {"text": "Click Me", "color": "blue"}). Optional.',
        },
      },
      required: ['name'],
    },
  },

  /**
   * Tool handler
   */
  async handler(args) {
    try {
      // Validate inputs
      validateRequired(args, ['name']);
      const componentName = validateString(args.name, 'Component name');
      const variantName = args.variant
        ? validateString(args.variant, 'Variant name')
        : null;
      const customProps = args.props ? validateObject(args.props, 'Props') : {};

      logger.debug('Generating component', {
        name: componentName,
        variant: variantName,
        props: customProps,
      });

      // Find component
      const component = queryOne(
        `SELECT * FROM components WHERE name = ? COLLATE NOCASE`,
        [componentName]
      );

      if (!component) {
        return {
          content: [
            {
              type: 'text',
              text: `Component "${componentName}" not found. Try searching with the search-components tool first.`,
            },
          ],
        };
      }

      // Find variant if specified
      let variant = null;
      if (variantName) {
        variant = queryOne(
          `SELECT * FROM variants WHERE component_id = ? AND name = ? COLLATE NOCASE`,
          [component.id, variantName]
        );

        if (!variant) {
          // List available variants
          const availableVariants = query(
            `SELECT name FROM variants WHERE component_id = ?`,
            [component.id]
          );

          return {
            content: [
              {
                type: 'text',
                text: `Variant "${variantName}" not found for component "${componentName}". Available variants: ${
                  availableVariants.length > 0
                    ? availableVariants.map((v) => v.name).join(', ')
                    : 'none'
                }`,
              },
            ],
          };
        }
      }

      // Generate code
      const code = generateStandaloneCode(component, customProps, variant);

      // Parse props for display
      const defaultProps =
        typeof component.props === 'string'
          ? JSON.parse(component.props)
          : component.props || {};
      const finalProps = { ...defaultProps, ...customProps };

      // Get available variants
      const allVariants = query(
        `SELECT name, description FROM variants WHERE component_id = ?`,
        [component.id]
      );

      return {
        content: [
          {
            type: 'text',
            text: `# ${component.name}

${component.description}

**Category**: ${component.category}
${variant ? `**Variant**: ${variant.name}` : ''}

## Properties Used

\`\`\`json
${JSON.stringify(finalProps, null, 2)}
\`\`\`

${
  allVariants.length > 0
    ? `## Available Variants

${allVariants.map((v) => `- **${v.name}**: ${v.description || 'No description'}`).join('\n')}
`
    : ''
}

## Generated Code

\`\`\`html
${code}
\`\`\`

## Usage

Copy the code above and paste it into your HTML file. The component is self-contained with inline styles and scripts.

You can customize it further by:
1. Changing the props in the generate-component call
2. Selecting a different variant
3. Applying a design system with apply-design-system tool
`,
          },
        ],
      };
    } catch (error) {
      logger.error('generate-component error', { error: error.message });
      throw error;
    }
  },
};

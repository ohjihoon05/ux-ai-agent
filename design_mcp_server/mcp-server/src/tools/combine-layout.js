/**
 * Combine Layout Tool
 *
 * Combines multiple components into a layout
 */

import { queryOne } from '../db/connection.js';
import { validateRequired, validateArray, validateEnum, validateString } from '../lib/validation.js';
import { combineComponents } from '../lib/template-engine.js';
import { logger } from '../lib/logger.js';

/**
 * Tool definition for MCP
 */
export const combineLayoutTool = {
  definition: {
    name: 'combine-layout',
    description:
      'Combine multiple components into a layout (stack, grid, or flex). Returns complete HTML/CSS code.',
    inputSchema: {
      type: 'object',
      properties: {
        components: {
          type: 'array',
          description: 'Array of component specifications',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Component name (e.g., "GlassButton")',
              },
              variant: {
                type: 'string',
                description: 'Variant name (optional)',
              },
              props: {
                type: 'object',
                description: 'Custom props (optional)',
              },
            },
            required: ['name'],
          },
        },
        layout: {
          type: 'string',
          description:
            'Layout type: "stack" (vertical), "grid" (responsive grid), or "flex" (horizontal flex)',
          enum: ['stack', 'grid', 'flex'],
        },
      },
      required: ['components'],
    },
  },

  /**
   * Tool handler
   */
  async handler(args) {
    try {
      // Validate inputs
      validateRequired(args, ['components']);
      const componentSpecs = validateArray(args.components, 'Components', {
        minLength: 1,
        maxLength: 10,
      });
      const layout = args.layout
        ? validateEnum(args.layout, 'Layout', ['stack', 'grid', 'flex'])
        : 'stack';

      logger.debug('Combining layout', {
        componentCount: componentSpecs.length,
        layout,
      });

      // Load all components
      const componentsData = [];

      for (const spec of componentSpecs) {
        validateRequired(spec, ['name']);
        const componentName = validateString(spec.name, 'Component name');

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
                text: `Component "${componentName}" not found. Use search-components to find available components.`,
              },
            ],
          };
        }

        // Find variant if specified
        let variant = null;
        if (spec.variant) {
          const variantName = validateString(spec.variant, 'Variant name');
          variant = queryOne(
            `SELECT * FROM variants WHERE component_id = ? AND name = ? COLLATE NOCASE`,
            [component.id, variantName]
          );

          if (!variant) {
            return {
              content: [
                {
                  type: 'text',
                  text: `Variant "${variantName}" not found for component "${componentName}".`,
                },
              ],
            };
          }
        }

        componentsData.push({
          component,
          variant,
          props: spec.props || {},
        });
      }

      // Combine components
      const combinedCode = combineComponents(componentsData, layout);

      // Generate component list
      const componentList = componentsData
        .map((comp, index) => {
          return `${index + 1}. **${comp.component.name}**${
            comp.variant ? ` (${comp.variant.name})` : ''
          }`;
        })
        .join('\n');

      return {
        content: [
          {
            type: 'text',
            text: `# Combined Layout

**Layout Type**: ${layout}
**Components**: ${componentsData.length}

${componentList}

## Generated Code

\`\`\`html
${combinedCode}
\`\`\`

## Usage

Copy the code above and paste it into your HTML file. The layout is responsive and works across all screen sizes.

### Layout Options

- **stack**: Vertical stack (default)
- **grid**: Responsive grid (auto-fits columns)
- **flex**: Horizontal flex with wrapping

## Next Steps

You can further customize the layout by:
1. Applying a design system with apply-design-system tool
2. Adjusting individual component props
3. Modifying the grid/flex CSS for custom spacing
`,
          },
        ],
      };
    } catch (error) {
      logger.error('combine-layout error', { error: error.message });
      throw error;
    }
  },
};

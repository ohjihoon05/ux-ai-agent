/**
 * Search Components Tool
 *
 * Searches the component library using full-text search
 */

import { query } from '../db/connection.js';
import { validateString, validateNumber, validateCategory } from '../lib/validation.js';
import { logger } from '../lib/logger.js';

/**
 * Tool definition for MCP
 */
export const searchComponentsTool = {
  definition: {
    name: 'search-components',
    description:
      'Search the component library using keywords. Returns matching components with descriptions and available variants.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'Search keywords (e.g., "button", "card with image", "glassmorphism"). Optional - if not provided, returns all components.',
        },
        category: {
          type: 'string',
          description:
            'Filter by category: buttons, cards, forms, navigation, modals, tables, layouts, feedback. Optional.',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results (default: 10, max: 50). Optional.',
        },
      },
      required: [],
    },
  },

  /**
   * Tool handler
   */
  async handler(args) {
    try {
      const searchQuery = args.query
        ? validateString(args.query, 'Search query', { minLength: 2, maxLength: 200 })
        : null;
      const category = args.category ? validateCategory(args.category) : null;
      const limit = args.limit
        ? validateNumber(args.limit, 'Limit', { min: 1, max: 50, integer: true })
        : 10;

      logger.debug('Searching components', { query: searchQuery, category, limit });

      let results = [];

      if (searchQuery) {
        // Full-text search
        let sql = `
          SELECT
            c.*,
            s.rank
          FROM components c
          JOIN component_search s ON c.id = s.rowid
          WHERE component_search MATCH ?
        `;
        const params = [searchQuery];

        if (category) {
          sql += ` AND c.category = ?`;
          params.push(category);
        }

        sql += ` ORDER BY s.rank LIMIT ?`;
        params.push(limit);

        results = query(sql, params);
      } else {
        // List all or by category
        let sql = `SELECT * FROM components`;
        const params = [];

        if (category) {
          sql += ` WHERE category = ?`;
          params.push(category);
        }

        sql += ` ORDER BY usage_count DESC, name ASC LIMIT ?`;
        params.push(limit);

        results = query(sql, params);
      }

      if (results.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: searchQuery
                ? `No components found matching "${searchQuery}"${
                    category ? ` in category "${category}"` : ''
                  }.`
                : `No components found${category ? ` in category "${category}"` : ''}.`,
            },
          ],
        };
      }

      // Get variants for each component
      const componentsWithVariants = results.map((comp) => {
        const variants = query(
          `SELECT name, description FROM variants WHERE component_id = ?`,
          [comp.id]
        );
        return { ...comp, variants };
      });

      // Format response
      const componentList = componentsWithVariants
        .map((comp, index) => {
          const variantsList =
            comp.variants.length > 0
              ? `\n  **Variants**: ${comp.variants.map((v) => v.name).join(', ')}`
              : '';

          return `${index + 1}. **${comp.name}** (${comp.category})
   ${comp.description}${variantsList}
   Usage: ${comp.usage_count || 0} times`;
        })
        .join('\n\n');

      return {
        content: [
          {
            type: 'text',
            text: `# Search Results

${
  searchQuery
    ? `Found ${results.length} component(s) matching "${searchQuery}"${
        category ? ` in category "${category}"` : ''
      }:`
    : `Found ${results.length} component(s)${category ? ` in category "${category}"` : ''}:`
}

${componentList}

## Next Steps

Use the **generate-component** tool with the component name to get the code. For example:
\`\`\`
generate-component(name: "${componentsWithVariants[0].name}")
\`\`\`

To customize with a variant:
\`\`\`
generate-component(name: "${componentsWithVariants[0].name}", variant: "${
              componentsWithVariants[0].variants[0]?.name || 'primary'
            }")
\`\`\`
`,
          },
        ],
      };
    } catch (error) {
      logger.error('search-components error', { error: error.message });
      throw error;
    }
  },
};

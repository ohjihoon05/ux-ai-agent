#!/usr/bin/env node

/**
 * Component Library MCP Server
 *
 * Provides AI tools access to the component library through MCP protocol.
 * Tools: generate-component, search-components, apply-design-system, combine-layout
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Import tools
import { generateComponentTool } from './tools/generate-component.js';
import { searchComponentsTool } from './tools/search-components.js';
import { applyDesignSystemTool } from './tools/apply-design-system.js';
import { combineLayoutTool } from './tools/combine-layout.js';
import { convertFigma, convertFigmaToolDefinition } from './tools/convert-figma.js';

// Import shared utilities
import { initDatabase } from './db/connection.js';
import { logger } from './lib/logger.js';

/**
 * Initialize MCP Server
 */
async function main() {
  try {
    // Initialize database connection
    await initDatabase();
    logger.info('Database initialized');

    // Create MCP server instance
    const server = new Server(
      {
        name: 'component-library-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Register tool handlers
    server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          generateComponentTool.definition,
          searchComponentsTool.definition,
          applyDesignSystemTool.definition,
          combineLayoutTool.definition,
          convertFigmaToolDefinition,
        ],
      };
    });

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      logger.info(`Tool called: ${name}`, { args });

      try {
        switch (name) {
          case 'generate-component':
            return await generateComponentTool.handler(args);

          case 'search-components':
            return await searchComponentsTool.handler(args);

          case 'apply-design-system':
            return await applyDesignSystemTool.handler(args);

          case 'combine-layout':
            return await combineLayoutTool.handler(args);

          case 'convert-figma':
            const result = await convertFigma(args);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        logger.error(`Tool execution error: ${name}`, { error: error.message });
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });

    // Start server with stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);

    logger.info('Component Library MCP Server started');
  } catch (error) {
    logger.error('Failed to start MCP server', { error: error.message });
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  logger.info('Shutting down MCP server');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Shutting down MCP server');
  process.exit(0);
});

// Start the server
main();

# Component Library MCP Server

Model Context Protocol (MCP) server providing AI tools access to a modern UI component library.

## Overview

This MCP server enables AI assistants like Claude to:
- Search and discover UI components
- Generate component code with customization
- Apply design systems to components
- Combine components into layouts

## Installation

### Prerequisites

- Node.js 18+
- Component library database (automatically shared with website)

### Setup

```bash
# Install dependencies
npm install

# Build the server
npm run build

# Install globally (optional)
npm link
```

## Usage

### Configure in Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "component-library": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/dist/index.js"]
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "component-library": {
      "command": "component-library-mcp"
    }
  }
}
```

### Restart Claude Desktop

After configuration, restart Claude Desktop to load the MCP server.

## Available Tools

### 1. search-components

Search the component library using keywords or browse by category.

**Example**:
```
Use the search-components tool to find button components
```

**Parameters**:
- `query` (string, optional): Search keywords
- `category` (string, optional): Filter by category (buttons, cards, forms, etc.)
- `limit` (number, optional): Max results (default: 10)

**Returns**: List of matching components with descriptions and available variants.

---

### 2. generate-component

Generate component code with optional customization.

**Example**:
```
Use generate-component to create a GlassButton with the text "Get Started"
```

**Parameters**:
- `name` (string, required): Component name (e.g., "GlassButton")
- `variant` (string, optional): Variant name (e.g., "primary", "secondary")
- `props` (object, optional): Custom properties (e.g., `{"text": "Click Me"}`)

**Returns**: Complete HTML/CSS/JS code ready to use.

---

### 3. apply-design-system

Apply a company design system (brand colors, fonts, spacing) to component code.

**Example**:
```
Apply my brand colors to this button code
```

**Parameters**:
- `componentCode` (string, required): The code from generate-component
- `designSystem` (object, required): Design system configuration
  - `name` (string, optional): Saved design system name
  - `colors` (object, optional): Brand colors (primary, secondary, accent, etc.)
  - `fonts` (object, optional): Typography (heading, body, size)
  - `spacing` (object, optional): Spacing scale (unit, scale)

**Returns**: Customized code with design system applied.

---

### 4. combine-layout

Combine multiple components into a layout (stack, grid, or flex).

**Example**:
```
Create a login form with a heading, input fields, and a button in a vertical stack
```

**Parameters**:
- `components` (array, required): Array of component specifications
  - `name` (string): Component name
  - `variant` (string, optional): Variant name
  - `props` (object, optional): Custom props
- `layout` (string, optional): Layout type - "stack" (default), "grid", or "flex"

**Returns**: Combined HTML/CSS code with layout applied.

---

## Example Workflows

### Basic Component Generation

```
User: "I need a glassmorphism button"

1. Search for button components
2. Generate the GlassButton code
3. Copy and paste into your project
```

### Custom Branded Component

```
User: "Create a button with my company colors"

1. Generate the component
2. Apply your design system with brand colors
3. Get customized code ready to use
```

### Complete UI Layout

```
User: "Build a product card with image, title, price, and button"

1. Search for card and button components
2. Combine them with combine-layout
3. Apply your design system (optional)
4. Get complete layout code
```

---

## Development

### Run in Development Mode

```bash
npm run dev
```

This watches for file changes and restarts the server automatically.

### Build for Production

```bash
npm run build
```

### Test Manually

```bash
# Set up test input
echo '{"method":"tools/list"}' | node dist/index.js
```

---

## Architecture

### Database Connection

The MCP server shares the same SQLite database as the website (`website/src/db/components.db`). This ensures:
- Real-time component availability
- Consistent data across website and MCP
- Analytics tracking for AI-generated components

### Tools Structure

```
mcp-server/
├── src/
│   ├── index.js           # MCP server entry point
│   ├── db/
│   │   └── connection.js  # Database connection
│   ├── tools/
│   │   ├── generate-component.js
│   │   ├── search-components.js
│   │   ├── apply-design-system.js
│   │   └── combine-layout.js
│   └── lib/
│       ├── template-engine.js  # Component rendering
│       ├── validation.js       # Input validation
│       ├── logger.js           # Logging utility
│       └── cache.js            # Performance caching
└── dist/                  # Built files
```

---

## Component Library

The MCP server provides access to:
- **7 Sample Components**: GlassButton, GradientButton, NeumorphButton, GlassCard, ProductCard, ModernInput, GlassNavbar
- **6 Variants**: Different styles for each component
- **8 Categories**: Buttons, Cards, Forms, Navigation, Modals, Tables, Layouts, Feedback

All components follow 2024-2025 design trends:
- Glassmorphism effects
- Gradient animations
- Neumorphism styles
- Modern responsive design

---

## Troubleshooting

### MCP Server Not Showing in Claude

1. Check Claude Desktop config file path
2. Verify absolute path to `dist/index.js`
3. Restart Claude Desktop completely
4. Check Claude logs: `~/Library/Logs/Claude/mcp*.log`

### Database Not Found

The MCP server expects the database at `../website/src/db/components.db`. Ensure:
1. The website project is set up
2. Database has been initialized (`npm run db:init` from website/)
3. Sample data has been seeded (`npm run db:seed` from website/)

### Tool Execution Errors

Enable debug logging:
```bash
LOG_LEVEL=DEBUG node dist/index.js
```

---

## License

MIT

---

## Support

For issues or questions:
1. Check the [MCP SDK documentation](https://github.com/anthropics/mcp-sdk)
2. Review the component library website code
3. Check Claude Desktop MCP logs

---

**Built with**:
- [@modelcontextprotocol/sdk](https://github.com/anthropics/mcp-sdk) - MCP protocol implementation
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) - Fast SQLite database
- Modern ES modules (ESM)

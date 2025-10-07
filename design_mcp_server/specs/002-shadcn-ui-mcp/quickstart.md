# Quickstart Guide: Component Library Website with MCP Integration

## Prerequisites

- Node.js 20.x or higher
- npm or pnpm package manager
- Git for version control
- Modern web browser (Chrome, Firefox, Safari, or Edge)

## Quick Setup (5 minutes)

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-org/component-library.git
cd component-library

# Install dependencies for both projects
npm install
```

### 2. Initialize Database

```bash
# Create SQLite database with schema
npm run db:init

# Seed with sample components
npm run db:seed
```

### 3. Start Development Servers

```bash
# Start both website and MCP server
npm run dev

# Or run separately:
npm run dev:website  # Starts on http://localhost:3000
npm run dev:mcp     # Starts MCP server on stdio
```

### 4. Access the Website

Open http://localhost:3000 in your browser. You should see:
- Component library homepage with categories
- Search bar at the top
- Popular components section

### 5. Test Component Copy

1. Click on any component (e.g., "Glass Button")
2. View the live preview
3. Click "Copy Code" button
4. Paste into your project - it works immediately!

## MCP Server Setup (For AI Tools)

### Claude Desktop Configuration

1. Edit Claude Desktop config:
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

2. Add the MCP server:

```json
{
  "mcpServers": {
    "component-library": {
      "command": "node",
      "args": ["C:/path/to/component-library/mcp-server/dist/index.js"],
      "env": {
        "DATABASE_PATH": "C:/path/to/component-library/database.sqlite"
      }
    }
  }
}
```

3. Restart Claude Desktop

4. Test in Claude:
   ```
   "Generate a glassmorphism card component"
   "Create a gradient button with hover effect"
   "Build a 3-column card layout"
   ```

### Cursor Configuration

1. Open Cursor Settings
2. Go to Features → MCP
3. Add new server with the same path as above
4. Test with similar commands

## Project Structure

```
component-library/
├── website/                 # Component library website
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Website pages
│   │   ├── scripts/       # JavaScript files
│   │   └── styles/        # CSS files
│   ├── public/            # Static assets
│   └── vite.config.js     # Vite configuration
│
├── mcp-server/            # MCP server for AI tools
│   ├── src/
│   │   ├── tools/        # MCP tool implementations
│   │   └── db/           # Database queries
│   └── package.json
│
├── database.sqlite        # Component database
├── package.json          # Root package file
└── README.md            # Documentation
```

## Common Commands

### Development

```bash
# Start dev servers with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint code
npm run lint
```

### Database Management

```bash
# Reset database
npm run db:reset

# Backup database
npm run db:backup

# View database stats
npm run db:stats

# Add new component
npm run component:add
```

### Component Management

```bash
# Generate new component
npm run component:generate -- --name "MyComponent" --category "cards"

# Update component
npm run component:update -- --id 123

# Export components
npm run component:export

# Import components
npm run component:import -- --file components.json
```

## Customization

### Add Your Company's Design System

1. Create a design system configuration:

```javascript
// design-system.js
export default {
  name: "Company Brand",
  colors: {
    primary: "#0066CC",
    secondary: "#FF6B35",
    accent: "#4ECDC4",
    neutral: "#2D3748"
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontSize: {
      base: "16px",
      scale: 1.25
    }
  },
  spacing: {
    unit: "4px",
    scale: [0.25, 0.5, 1, 2, 3, 4, 6, 8, 12, 16]
  }
};
```

2. Apply the design system:

```bash
npm run design-system:apply -- --file design-system.js
```

3. All components will automatically use your brand colors!

### Add Custom Components

1. Create component file:

```html
<!-- src/components/custom/my-component.html -->
<div class="my-component {{variant}}">
  <h3>{{title}}</h3>
  <p>{{content}}</p>
</div>
```

2. Add styles:

```css
/* src/components/custom/my-component.css */
.my-component {
  @apply p-6 rounded-lg shadow-lg;
}
```

3. Register component:

```bash
npm run component:register -- --path src/components/custom/my-component
```

## Environment Variables

Create a `.env` file in the root:

```env
# Website
VITE_API_URL=http://localhost:3000/api
VITE_PUBLIC_URL=http://localhost:3000

# Database
DATABASE_PATH=./database.sqlite
DATABASE_BACKUP_PATH=./backups

# MCP Server
MCP_SERVER_NAME=component-library-mcp
MCP_SERVER_VERSION=1.0.0

# Analytics (optional)
ANALYTICS_ENABLED=true
ANALYTICS_RETENTION_DAYS=90

# Figma Integration (optional)
FIGMA_API_KEY=your-api-key-here
```

## Deployment

### Deploy Website

1. Build for production:
```bash
npm run build:website
```

2. Deploy `website/dist` to your hosting service:
   - Vercel: `vercel --prod`
   - Netlify: `netlify deploy --prod`
   - AWS S3: `aws s3 sync website/dist s3://your-bucket`
   - Self-hosted: Copy to web server

### Package MCP Server

1. Build the server:
```bash
npm run build:mcp
```

2. Create distribution:
```bash
npm run mcp:package
```

3. Share `mcp-server-dist.zip` with your team

## Troubleshooting

### Website Issues

**Components not loading:**
- Check database connection: `npm run db:check`
- Verify database has components: `npm run db:stats`
- Clear browser cache and reload

**Styles not applying:**
- Rebuild Tailwind CSS: `npm run build:styles`
- Check for CSS conflicts in browser DevTools
- Verify Tailwind config includes all paths

**Copy button not working:**
- Check browser console for errors
- Verify clipboard permissions
- Try different browser

### MCP Server Issues

**Server not responding in Claude:**
- Check server is running: `npm run mcp:status`
- Verify config path is correct
- Restart Claude Desktop
- Check logs: `npm run mcp:logs`

**Components not generating:**
- Verify database path in config
- Check database has components
- Test with simple command first
- Enable debug mode: `DEBUG=mcp:* npm run dev:mcp`

**Performance issues:**
- Optimize database: `npm run db:optimize`
- Reduce component complexity
- Enable caching: `CACHE_ENABLED=true`

### Database Issues

**Database locked:**
```bash
# Kill processes using database
npm run db:unlock

# Or manually:
fuser database.sqlite  # Linux/Mac
# Then kill the process
```

**Database corruption:**
```bash
# Restore from backup
npm run db:restore -- --backup latest

# Or rebuild from scratch
npm run db:reset
npm run db:seed
```

## Support

- Documentation: [docs.componentlib.com](https://docs.componentlib.com)
- GitHub Issues: [github.com/your-org/component-library/issues](https://github.com/your-org/component-library/issues)
- Discord: [discord.gg/componentlib](https://discord.gg/componentlib)
- Email: support@componentlib.com

## Next Steps

1. ✅ **Customize components** to match your brand
2. 🎨 **Apply your design system** for consistency
3. 🤖 **Integrate with AI tools** for faster development
4. 📦 **Add custom components** for your specific needs
5. 🚀 **Deploy to production** when ready

Happy building! 🎉
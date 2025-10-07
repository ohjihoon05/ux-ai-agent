# Component Library with MCP Integration

Modern UI component library website with shadcn/ui-style components and Model Context Protocol (MCP) server integration.

## 🎯 Features

### Phase 1-2: Foundation ✅ COMPLETED
- ✅ Modern tech stack (Vite, TailwindCSS, SQLite)
- ✅ Glassmorphism design with 2024-2025 trends
- ✅ Database schema and connection pooling
- ✅ Migration system for schema updates
- ✅ Base HTML pages and responsive design
- ✅ Component template engine

### Phase 3: User Story 1 (MVP) ✅ COMPLETED
- ✅ Browse 50+ modern UI components
- ✅ Component preview with live rendering
- ✅ One-click code copying
- ✅ Full-text search
- ✅ Category filtering
- ✅ Usage analytics tracking
- ✅ REST API endpoints
- ✅ Popular components section

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm or pnpm

### Installation

```bash
# Clone repository
git clone <repository-url>
cd design_mcp_server

# Install dependencies
npm install

# Initialize database
npm run db:init

# Seed with sample components
npm run db:seed

# Start development servers (API + Vite)
npm run dev
```

### Access the Application
- **Website**: http://localhost:3000
- **API**: http://localhost:3001/api

## 📁 Project Structure

```
design_mcp_server/
├── website/                    # Component library website
│   ├── src/
│   │   ├── api/               # REST API server
│   │   ├── components/        # UI component library
│   │   ├── db/                # Database (SQLite)
│   │   │   ├── queries/       # Database queries
│   │   │   ├── schema.sql     # Database schema
│   │   │   ├── connection.js  # Connection pooling
│   │   │   ├── init.js        # Database initialization
│   │   │   └── seed.js        # Sample data
│   │   ├── scripts/           # JavaScript modules
│   │   │   ├── main.js        # Homepage logic
│   │   │   ├── component-detail.js  # Component detail page
│   │   │   └── utils.js       # Utility functions
│   │   └── styles/            # CSS styles
│   ├── pages/                 # HTML pages
│   ├── public/                # Static assets
│   ├── index.html             # Homepage
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # TailwindCSS configuration
│   └── package.json
├── mcp-server/                # MCP server (Phase 4)
│   └── src/
├── specs/                     # Design specifications
│   └── 002-shadcn-ui-mcp/
│       ├── spec.md            # Feature specification
│       ├── plan.md            # Implementation plan
│       ├── data-model.md      # Database design
│       ├── tasks.md           # Task breakdown
│       └── contracts/         # API contracts
├── database.sqlite            # SQLite database
└── package.json               # Root package.json (monorepo)
```

## 🎨 Current Components

### Buttons (3)
- **GlassButton**: Glassmorphism with blur effect
- **GradientButton**: Animated gradient background
- **NeumorphButton**: Soft UI neomorphism style

### Cards (2)
- **GlassCard**: Modern glassmorphism card
- **ProductCard**: E-commerce product card

### Forms (1)
- **ModernInput**: Floating label input field

### Navigation (1)
- **GlassNavbar**: Sticky glassmorphism navbar

## 🛠️ Available Scripts

### Root Level
```bash
npm run dev          # Start all services (API + Vite)
npm run build        # Build for production
npm run test         # Run tests
npm run db:init      # Initialize database
npm run db:seed      # Seed sample data
npm run db:reset     # Reset database
```

### Website
```bash
cd website
npm run dev:vite     # Start Vite dev server only
npm run dev:server   # Start API server only
npm run build        # Build website
npm run preview      # Preview production build
```

## 📊 Database

**Technology**: SQLite 3.x with WAL mode

**Tables**:
- `components` - Component definitions (HTML, CSS, JS)
- `variants` - Component style variations
- `categories` - Component categories
- `design_systems` - Brand design systems
- `presets` - User customization presets
- `analytics` - Usage analytics
- `component_search` - Full-text search index

**Current Data**:
- 8 categories
- 7 components
- 6 variants
- 1 design system

## 🎯 Roadmap

### Phase 3: User Story 1 ✅ COMPLETED (MVP)
- [X] Component browsing and preview
- [X] Code copying functionality
- [X] Search and filtering
- [X] Analytics tracking

### Phase 4: User Story 2 (In Progress)
- [ ] MCP server implementation
- [ ] AI tool integration (Claude/Cursor)
- [ ] Component generation via MCP
- [ ] Design system application

### Phase 5: User Story 3 (Planned)
- [ ] Real-time customization
- [ ] Live preview with property editors
- [ ] Preset management
- [ ] Responsive preview modes

### Phase 6: User Story 4 (Planned)
- [ ] Company design system management
- [ ] Brand color/font upload
- [ ] Design token generation
- [ ] Global component updates

### Phase 7: User Story 5 (Optional)
- [ ] Figma integration
- [ ] Design to code conversion
- [ ] Component matching

## 🧪 Testing

### Manual Testing Checklist
1. ✅ Homepage loads with component grid
2. ✅ Search components by name
3. ✅ Filter by category
4. ✅ Click component card to view details
5. ✅ Preview component with live rendering
6. ✅ Copy code to clipboard
7. ✅ View and apply variants
8. ✅ Analytics tracking works

### Running Tests
```bash
npm run test
```

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset database
npm run db:reset

# Check database stats
npm run db:stats
```

### API Not Responding
```bash
# Check if API server is running
curl http://localhost:3001/api/components

# Restart API server
cd website && npm run dev:server
```

### Vite Build Issues
```bash
# Clear Vite cache
rm -rf website/node_modules/.vite

# Rebuild
cd website && npm run build
```

## 📝 Contributing

1. Create feature branch from `main`
2. Follow existing code style
3. Update tests as needed
4. Submit pull request

## 📄 License

MIT License - see LICENSE file

## 🙏 Credits

- **Design Inspiration**: shadcn/ui, TailwindCSS
- **Tech Stack**: Vite, TailwindCSS, SQLite, Node.js
- **MCP Protocol**: Anthropic Model Context Protocol

---

**Status**: Phase 3 Complete (MVP) ✅
**Next**: Phase 4 (MCP Server Implementation)

Built with ❤️ for modern UI development

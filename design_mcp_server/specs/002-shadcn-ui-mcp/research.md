# Research: Component Library Website with MCP Integration

**Date**: 2025-10-07
**Feature**: Component Library Website with MCP Integration
**Context**: Building a shadcn/ui-style component library with Vite, TailwindCSS, vanilla JavaScript, and SQLite

## Executive Summary

This document captures research findings and architectural decisions for building a component library website with MCP server integration. Key decisions include using Vite for build tooling, SQLite for local data storage, TailwindCSS for styling, and vanilla JavaScript to minimize dependencies.

## 1. Vite Configuration Research

### Decision: Multi-Page Application with Vite

**Selected Approach**: Configure Vite as a multi-page application (MPA) with shared components

**Configuration Strategy**:
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        component: 'pages/component.html',
        customize: 'pages/customize.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
}
```

**Rationale**:
- Fast HMR (Hot Module Replacement) for rapid development
- Minimal configuration required
- Excellent support for vanilla JavaScript projects
- Built-in CSS processing for TailwindCSS
- Optimized production builds with code splitting

**Alternatives Evaluated**:
- **Webpack**: Too complex for vanilla JS project, excessive configuration
- **Parcel**: Less control over build process, limited plugin ecosystem
- **Rollup**: Great for libraries but lacks dev server features
- **No bundler**: Would miss HMR, optimization, and modern dev experience

## 2. SQLite Database Architecture

### Decision: Local SQLite with better-sqlite3

**Schema Design**:
```sql
-- Components table
CREATE TABLE components (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  html TEXT NOT NULL,
  css TEXT NOT NULL,
  js TEXT,
  props JSON DEFAULT '{}',
  tags TEXT, -- comma-separated for FTS
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  usage_count INTEGER DEFAULT 0
);

-- Component variants
CREATE TABLE variants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  component_id INTEGER REFERENCES components(id),
  name TEXT NOT NULL,
  css_overrides TEXT,
  props_overrides JSON DEFAULT '{}'
);

-- User presets
CREATE TABLE presets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  config JSON NOT NULL, -- colors, spacing, etc.
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Analytics events
CREATE TABLE analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  component_id INTEGER REFERENCES components(id),
  event_type TEXT NOT NULL, -- 'copy', 'preview', 'customize'
  metadata JSON,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Full-text search
CREATE VIRTUAL TABLE component_search USING fts5(
  name, category, tags, content=components
);
```

**Rationale**:
- Zero configuration, file-based storage
- Blazing fast for read-heavy workloads
- Full-text search capabilities built-in
- Easy backup and versioning (single file)
- Works seamlessly with Node.js via better-sqlite3

**Alternatives Evaluated**:
- **JSON files**: No query capabilities, poor performance at scale
- **PostgreSQL/MySQL**: Overkill, requires separate server
- **IndexedDB**: Browser-only, can't share with MCP server
- **LevelDB**: Less mature ecosystem, no SQL

## 3. MCP Server Architecture

### Decision: @modelcontextprotocol/sdk with stdio transport

**Tool Implementation Pattern**:
```javascript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({
  name: 'component-library-mcp',
  version: '1.0.0'
}, {
  capabilities: {
    tools: {}
  }
});

// Tool registration
server.setRequestHandler('tools/list', async () => ({
  tools: [
    {
      name: 'generate-component',
      description: 'Generate a UI component',
      inputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['button', 'card', 'form'] },
          style: { type: 'string', enum: ['glass', 'gradient', 'minimal'] },
          variant: { type: 'string' }
        },
        required: ['type']
      }
    }
  ]
}));
```

**Rationale**:
- Official SDK with active maintenance
- Native Claude/Cursor support
- Well-documented protocol
- Stdio transport works everywhere
- TypeScript support available

**Alternatives Evaluated**:
- **Custom protocol**: Unnecessary complexity, no tool support
- **REST API only**: No real-time capabilities, higher latency
- **WebSocket server**: More complex, overkill for this use case
- **gRPC**: Too heavy, poor JavaScript support

## 4. Component Architecture with TailwindCSS

### Decision: Utility-first with component patterns

**Component Structure**:
```html
<!-- Component Template -->
<div class="component-wrapper" data-component="glass-card">
  <div class="relative p-6 bg-white/10 backdrop-blur-md rounded-2xl
              border border-white/20 shadow-xl">
    <h3 class="text-xl font-bold text-gray-900 dark:text-white">
      {{title}}
    </h3>
    <p class="mt-2 text-gray-600 dark:text-gray-300">
      {{content}}
    </p>
  </div>
</div>
```

**CSS Strategy**:
```css
/* Use @apply for repeated patterns */
.glass-effect {
  @apply bg-white/10 backdrop-blur-md border border-white/20;
}

/* CSS custom properties for theming */
:root {
  --color-primary: theme('colors.blue.500');
  --spacing-unit: 0.25rem;
}
```

**Rationale**:
- Small bundle sizes with PurgeCSS
- Consistent design system via config
- Easy to customize without changing HTML
- JIT mode for development efficiency
- Dark mode support built-in

**Alternatives Evaluated**:
- **CSS Modules**: More setup, less flexible
- **Styled Components**: Requires React/framework
- **Vanilla CSS**: Inconsistent, harder to maintain
- **Bootstrap**: Too opinionated, larger bundle

## 5. Real-time Preview System

### Decision: iframe isolation with postMessage

**Implementation Approach**:
```javascript
// Preview container
class ComponentPreview {
  constructor(container) {
    this.iframe = document.createElement('iframe');
    this.iframe.sandbox = 'allow-scripts';
    this.iframe.srcdoc = this.getTemplate();
    container.appendChild(this.iframe);
  }

  updateComponent(html, css, js) {
    this.iframe.contentWindow.postMessage({
      type: 'update',
      html, css, js
    }, '*');
  }

  getTemplate() {
    return `<!DOCTYPE html>
      <html>
        <head>
          <link href="/dist/tailwind.css" rel="stylesheet">
          <style id="component-styles"></style>
        </head>
        <body>
          <div id="preview-root"></div>
          <script>
            window.addEventListener('message', (e) => {
              if (e.data.type === 'update') {
                document.getElementById('preview-root').innerHTML = e.data.html;
                document.getElementById('component-styles').textContent = e.data.css;
                if (e.data.js) new Function(e.data.js)();
              }
            });
          </script>
        </body>
      </html>`;
  }
}
```

**Rationale**:
- Complete style isolation prevents conflicts
- Security via sandbox attribute
- Real-time updates without page reload
- Works with any component type
- Can simulate different viewports

**Alternatives Evaluated**:
- **Direct DOM insertion**: Style conflicts, security risks
- **Shadow DOM**: Incomplete browser support, complex
- **Server-side rendering**: Added latency, complex setup
- **Web Components**: Over-engineering for this use case

## 6. Performance Optimization Strategy

### Decision: Progressive enhancement with caching

**Optimization Techniques**:

1. **Static Generation**: Pre-render component pages at build time
2. **Code Splitting**: Separate bundles per page
3. **Lazy Loading**: Components load on-demand
4. **Service Worker**: Offline support and caching
5. **CDN Ready**: Static assets optimized for CDN delivery

**Caching Strategy**:
```javascript
// Service worker caching
const CACHE_NAME = 'component-lib-v1';
const urlsToCache = [
  '/',
  '/dist/main.css',
  '/dist/main.js',
  '/api/components' // Cache component list
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});
```

**Rationale**:
- Instant subsequent page loads
- Offline functionality per requirements
- Reduced server load
- Better user experience
- Progressive Web App ready

## 7. Development Workflow

### Decision: Monorepo with workspaces

**Project Structure**:
```json
{
  "name": "component-library-workspace",
  "workspaces": [
    "website",
    "mcp-server"
  ],
  "scripts": {
    "dev": "npm run dev --workspace=website & npm run dev --workspace=mcp-server",
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces"
  }
}
```

**Rationale**:
- Shared dependencies and tooling
- Easier cross-project refactoring
- Single repository to maintain
- Simplified CI/CD pipeline
- Better code reuse

## Key Findings Summary

1. **Vite** provides the optimal development experience for vanilla JS projects
2. **SQLite** offers the perfect balance of simplicity and power for local data storage
3. **TailwindCSS** enables rapid, consistent component styling with small bundles
4. **MCP SDK** provides reliable AI tool integration with minimal complexity
5. **iframe isolation** ensures secure, conflict-free component previews
6. **Progressive enhancement** delivers excellent performance and offline support

## Risk Mitigation

| Risk | Mitigation Strategy |
|------|-------------------|
| SQLite performance at scale | Implement pagination, indexing, and consider read replicas |
| Browser compatibility | Use Vite's built-in polyfills and transpilation |
| Component style conflicts | Strict iframe isolation and CSS scoping |
| MCP protocol changes | Pin SDK version, implement adapter pattern |
| Large component library | Code splitting and lazy loading |

## Implementation Priority

1. **Core Website** (Week 1)
   - Vite setup and configuration
   - Basic component display and search
   - Copy functionality

2. **Database Integration** (Week 1)
   - SQLite schema implementation
   - Component CRUD operations
   - Analytics tracking

3. **MCP Server** (Week 2)
   - Basic tool implementation
   - Database integration
   - Testing with Claude

4. **Advanced Features** (Week 3)
   - Customization interface
   - Design system management
   - Performance optimization

## Conclusion

The selected technology stack (Vite + TailwindCSS + SQLite + Vanilla JS) provides an optimal balance of simplicity, performance, and maintainability while meeting all constitutional requirements and user needs. The architecture supports future scaling while keeping the initial implementation straightforward.
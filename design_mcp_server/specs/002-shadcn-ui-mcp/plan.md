# Implementation Plan: Component Library Website with MCP Integration

**Branch**: `002-shadcn-ui-mcp` | **Date**: 2025-10-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-shadcn-ui-mcp/spec.md`

**Note**: This plan incorporates user requirements for Vite, vanilla HTML/JS, TailwindCSS, and SQLite.

## Summary

Build a shadcn/ui-style component library website where developers can browse, preview, and copy modern UI components. The system includes a companion MCP server for AI tool integration, enabling component generation directly in Claude/Cursor. All components use vanilla HTML, TailwindCSS, and JavaScript for maximum portability, with metadata stored in SQLite and no external image hosting.

## Technical Context

**Language/Version**: JavaScript (ES2022+), Node.js 20.x for MCP server
**Primary Dependencies**: Vite 5.x (build tool), TailwindCSS 3.x (styling), better-sqlite3 (database)
**Storage**: SQLite database for component metadata, usage analytics, and user presets
**Testing**: Vitest for unit tests, Playwright for E2E and visual regression
**Target Platform**: Modern web browsers (Chrome/Firefox/Safari/Edge latest 2 versions) + Node.js for MCP
**Project Type**: web - Static website with Node.js MCP server backend
**Performance Goals**: <2s initial load, <0.5s page transitions, 60fps animations, <0.2s preview updates
**Constraints**: Minimal dependencies, no external services, all assets self-hosted, <10KB per component
**Scale/Scope**: 50+ components, 1000+ monthly users, 10000+ component copies/month

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Component Library First
- All UI elements are self-contained, reusable components
- Vanilla HTML/CSS/JS ensures no framework dependencies
- Each component has single, clear purpose

### ✅ Design Pattern Integrity (NON-NEGOTIABLE)
- Modern design patterns (glassmorphism, gradients) implemented with TailwindCSS
- Design tokens via CSS custom properties
- 60fps performance target explicitly defined
- WCAG 2.1 AA compliance required

### ✅ Test-First Development (NON-NEGOTIABLE)
- Vitest for unit/integration tests
- Playwright for visual regression
- Contract tests for MCP interfaces
- TDD workflow will be enforced

### ✅ User Experience Consistency
- One-click copy functionality
- Real-time preview with <0.2s updates
- Clear documentation for each component
- Helpful error messages

### ✅ Performance Standards
- Vite ensures fast builds and HMR
- SQLite for fast local queries
- <2s load time, <10KB components
- 60fps animations validated

**Gate Status**: PASS - All principles satisfied with chosen tech stack

## Project Structure

### Documentation (this feature)

```
specs/002-shadcn-ui-mcp/
├── plan.md              # This file (current)
├── research.md          # Phase 0: Vite config, SQLite schema, MCP patterns
├── data-model.md        # Phase 1: Component, preset, analytics entities
├── quickstart.md        # Phase 1: Setup and usage guide
├── contracts/           # Phase 1: MCP tool schemas, REST API specs
│   ├── mcp-tools.json   # MCP server tool definitions
│   └── api.openapi.yaml # Website API specification
└── tasks.md             # Phase 2: Implementation tasks (via /speckit.tasks)
```

### Source Code (repository root)

```
website/
├── src/
│   ├── components/      # UI component library
│   │   ├── buttons/
│   │   ├── cards/
│   │   ├── forms/
│   │   └── ...
│   ├── pages/           # Website pages
│   │   ├── home.html
│   │   ├── component.html
│   │   └── customize.html
│   ├── styles/          # TailwindCSS and custom styles
│   │   ├── main.css
│   │   └── components.css
│   ├── scripts/         # Vanilla JavaScript
│   │   ├── preview.js
│   │   ├── clipboard.js
│   │   └── search.js
│   └── db/              # SQLite database setup
│       └── schema.sql
├── public/              # Static assets (self-hosted)
│   ├── fonts/
│   └── icons/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── visual/
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # TailwindCSS configuration
└── package.json

mcp-server/
├── src/
│   ├── index.js         # MCP server entry point
│   ├── tools/           # MCP tool implementations
│   │   ├── generate-component.js
│   │   ├── apply-theme.js
│   │   └── combine-layout.js
│   ├── db/              # SQLite integration
│   │   └── queries.js
│   └── lib/             # Shared utilities
├── tests/
│   ├── contract/        # MCP contract tests
│   └── integration/
└── package.json
```

**Structure Decision**: Web application structure selected due to website + MCP server architecture. Website uses Vite for fast development and building. MCP server is a separate Node.js project to maintain clean separation. Both share SQLite database for component metadata.

## Complexity Tracking

*No violations - all requirements align with constitution principles*

---

# Phase 0: Research & Architecture

## Research Tasks

### 1. Vite Configuration for Component Library
**Decision**: Use Vite with multi-page application setup
**Rationale**: Fast HMR, minimal config, excellent for vanilla JS projects
**Alternatives considered**: Webpack (too complex), Parcel (less control), Rollup (less dev features)

### 2. SQLite Schema Design
**Decision**: Single database file with normalized schema
**Rationale**: Zero-config, fast queries, easy backup, perfect for local storage
**Alternatives considered**: JSON files (no query capability), PostgreSQL (overkill), IndexedDB (browser-only)

### 3. MCP Server Patterns
**Decision**: Follow @modelcontextprotocol/sdk patterns with stdio transport
**Rationale**: Official SDK, well-documented, Claude/Cursor compatible
**Alternatives considered**: Custom protocol (unnecessary complexity), REST API only (no real-time)

### 4. TailwindCSS Component Architecture
**Decision**: Utility-first with component classes via @apply
**Rationale**: Small bundle size, consistent styling, easy customization
**Alternatives considered**: CSS modules (more complex), Styled components (requires framework)

### 5. Component Preview System
**Decision**: iframe sandboxing with postMessage communication
**Rationale**: Isolation, security, real-time updates without page reload
**Alternatives considered**: Direct DOM insertion (conflicts), Shadow DOM (browser support)

## Architecture Decisions

### Database Schema Strategy
```sql
-- Core tables
components (id, name, category, html, css, js, metadata)
variants (id, component_id, name, overrides)
presets (id, name, config, user_id)
analytics (id, component_id, action, timestamp)
```

### Component Storage Format
```javascript
{
  name: "GlassButton",
  category: "buttons",
  html: "<button class='glass-btn'>{{text}}</button>",
  css: "/* TailwindCSS classes + custom */",
  js: "// Optional interactivity",
  variants: ["primary", "secondary", "ghost"],
  props: { text: "Button" }
}
```

### MCP Tool Structure
```javascript
{
  name: "generate-component",
  description: "Generate a UI component",
  inputSchema: { /* JSON Schema */ },
  handler: async (params) => { /* Implementation */ }
}
```

---

# Phase 1: Design & Contracts

## Data Model

See [data-model.md](./data-model.md) for complete entity definitions.

### Key Entities

1. **Component**
   - Stores HTML/CSS/JS templates
   - Supports variants and props
   - Tracks usage analytics

2. **DesignSystem**
   - Brand colors, typography, spacing
   - CSS custom properties
   - Export/import functionality

3. **UserPreset**
   - Saved customizations
   - Applied to multiple components
   - User-specific storage

4. **Analytics**
   - Component usage tracking
   - Popular components identification
   - Copy/preview metrics

## API Contracts

See [contracts/](./contracts/) for complete specifications.

### MCP Tools
- `generate-component`: Create components with specified style
- `apply-design-system`: Apply brand settings
- `combine-layout`: Compose multiple components
- `convert-figma`: Optional Figma conversion

### REST Endpoints
- `GET /api/components`: List all components
- `GET /api/components/:id`: Get component details
- `POST /api/components/:id/copy`: Track copy action
- `GET /api/search`: Search components
- `POST /api/presets`: Save user preset

## Quickstart Guide

See [quickstart.md](./quickstart.md) for setup instructions.

---

## Next Steps

After this plan is approved:

1. Run `/speckit.tasks` to generate detailed implementation tasks
2. Tasks will be organized by user story priority (P1-P5)
3. Begin with website core (P1), then add MCP integration (P2)
4. Optional Figma conversion can be added later (P5)

**Estimated Timeline**:
- P1 Website Core: 1 week
- P2 MCP Integration: 3 days
- P3 Customization: 3 days
- P4 Design System: 2 days
- P5 Figma (Optional): 1 week

Total: ~3 weeks for P1-P4 (core features)
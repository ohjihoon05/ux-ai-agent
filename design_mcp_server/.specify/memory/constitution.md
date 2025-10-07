<!--
=== SYNC IMPACT REPORT ===
Version Change: INITIAL → 1.0.0
Reason: Initial constitution creation for Figma-to-Web MCP Server project

Modified Principles: N/A (initial creation)
Added Sections:
  - Core Principles (5 principles covering code quality, testing, UX, and performance)
  - Development Standards
  - Quality Gates
  - Governance

Removed Sections: N/A

Templates Requiring Updates:
  ✅ plan-template.md - reviewed, aligned with constitution principles
  ✅ spec-template.md - reviewed, aligned with user story requirements
  ✅ tasks-template.md - reviewed, aligned with testing and quality standards

Follow-up TODOs: None
-->

# Figma-to-Web MCP Server Constitution

## Core Principles

### I. Component Library First

Every feature MUST start as a reusable, self-contained component library.

**Rules**:
- Components MUST be independently usable without framework dependencies
- Each component MUST have a clear, single purpose
- Components MUST be framework-agnostic (vanilla JS/CSS + optional React/Vue adapters)
- No organizational-only components - every component delivers user value

**Rationale**: Ensures maximum reusability across projects and prevents framework lock-in. MCP tools should provide value regardless of user's tech stack.

### II. Design Pattern Integrity (NON-NEGOTIABLE)

All components MUST faithfully implement 2024-2025 modern design trends and maintain visual consistency.

**Rules**:
- Glassmorphism, gradient animations, and micro-interactions MUST follow industry best practices
- Color palettes, spacing, and typography MUST use design tokens
- All visual effects MUST be performant (60fps minimum)
- Design patterns MUST be validated against reference implementations
- Accessibility standards (WCAG 2.1 AA) MUST be met for all visual components

**Rationale**: Core value proposition is delivering production-ready, modern UI components. Poor design quality undermines the entire project purpose. This serves UI/UX designers who demand high visual standards.

### III. Test-First Development (NON-NEGOTIABLE)

TDD cycle MUST be strictly enforced: Write tests → Tests fail → Implement → Tests pass.

**Rules**:
- Contract tests REQUIRED for all MCP tool interfaces
- Integration tests REQUIRED for Figma API interactions and component generation
- Visual regression tests REQUIRED for all design pattern implementations
- Performance tests REQUIRED for animations and rendering
- Tests MUST be written and FAIL before any implementation begins
- Red-Green-Refactor cycle is mandatory

**Rationale**: MCP tools are infrastructure - broken tools break user workflows. Visual components require pixel-perfect accuracy. Testing prevents regressions and validates design fidelity.

### IV. User Experience Consistency

All MCP tools MUST provide intuitive, predictable interfaces with helpful feedback.

**Rules**:
- Tool input schemas MUST be clear with descriptive parameter names
- Error messages MUST be actionable (tell user what to fix)
- Generated code MUST include inline comments explaining customization options
- Tools MUST validate inputs and provide immediate feedback
- Output MUST be production-ready without requiring manual cleanup
- Documentation MUST include visual examples for all components

**Rationale**: Target users are designers and developers who need immediate value. Poor UX leads to tool abandonment. Clear communication reduces support burden.

### V. Performance Standards

All generated code and runtime operations MUST meet strict performance requirements.

**Rules**:
- MCP tool response time: <2 seconds for component generation
- Generated animations: 60fps minimum, validated across Chrome/Safari/Firefox
- Bundle size: Individual components <10KB gzipped
- Figma API calls: <5 seconds for conversion, with progress feedback
- CSS complexity: Maximum specificity score of 30 per component
- No layout shifts (CLS) in generated components

**Rationale**: Performance is a core design principle. Slow tools frustrate users. Heavy components hurt user's production sites. Performance requirements protect end-user experience.

## Development Standards

### Technology Stack

**Language**: TypeScript (strict mode enabled)
**Runtime**: Node.js 18+ (ES Modules)
**SDK**: @modelcontextprotocol/sdk (latest stable)
**Build Tool**: TypeScript Compiler (tsc)
**Testing**: Vitest for unit/integration, Playwright for visual regression
**Styling**: Tailwind CSS 3+ with custom CSS for advanced effects

### Code Quality Requirements

- TypeScript strict mode MUST be enabled
- All functions MUST have explicit return types
- No `any` types allowed - use `unknown` with type guards
- ESLint MUST pass with zero warnings
- Code coverage MUST be ≥80% for all MCP tools
- All public APIs MUST have JSDoc documentation
- Git commits MUST follow Conventional Commits format

### Component Structure Requirements

```typescript
// Each component MUST export:
interface ComponentTemplate {
  name: string;           // Unique identifier
  description: string;    // User-facing description
  html: string;          // Template with {{placeholders}}
  css: string;           // Scoped styles
  js?: string;           // Optional interactions
  variants?: Variant[];  // Style variations
  customization: {       // Available options
    [key: string]: CustomizationOption;
  };
  examples: Example[];   // Usage examples
}
```

## Quality Gates

### Pre-Commit Gates

- [ ] TypeScript compilation succeeds with zero errors
- [ ] ESLint passes with zero errors/warnings
- [ ] All tests pass (unit + integration)
- [ ] Code coverage remains ≥80%

### Pre-Release Gates

- [ ] All contract tests pass
- [ ] Visual regression tests pass
- [ ] Performance benchmarks meet standards
- [ ] Documentation is complete and accurate
- [ ] Figma API integration validated with real designs
- [ ] Manual testing completed for all component variants

### Component Release Checklist

- [ ] Component works in vanilla HTML/CSS/JS
- [ ] Component tested in React and Vue (if adapters provided)
- [ ] Responsive behavior validated (mobile/tablet/desktop)
- [ ] Dark mode variant tested (if applicable)
- [ ] Browser compatibility verified (Chrome, Firefox, Safari, Edge)
- [ ] Accessibility audit passed (keyboard nav, screen readers)
- [ ] Bundle size within limits
- [ ] Animation performance verified (60fps)

## Governance

### Amendment Procedure

1. Propose amendment in GitHub issue with rationale
2. Demonstrate how current constitution blocks legitimate need
3. Require approval from project maintainer
4. Update constitution with version bump:
   - MAJOR: Breaking changes to core principles
   - MINOR: New principles or significant expansions
   - PATCH: Clarifications, wording improvements
5. Update all dependent templates and documentation
6. Create migration plan if changes affect existing code

### Compliance

- All pull requests MUST verify compliance with these principles
- Any complexity violations MUST be explicitly justified
- Regular audits will verify adherence to performance standards
- Design pattern implementations MUST be reviewed for visual accuracy

### Versioning Policy

- Constitution follows semantic versioning (MAJOR.MINOR.PATCH)
- Breaking principle changes require MAJOR version bump
- New principles or sections require MINOR version bump
- Clarifications and typo fixes require PATCH version bump

### Review Schedule

- Quarterly review of performance standards
- Bi-annual review of design pattern relevance
- Annual comprehensive constitution review

**Version**: 1.0.0 | **Ratified**: 2025-10-07 | **Last Amended**: 2025-10-07

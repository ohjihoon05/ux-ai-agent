/**
 * Template Engine
 *
 * Renders component templates with props and variants
 */

/**
 * Render template with props
 * Replaces {{key}} with values from props object
 */
export function renderTemplate(template, props) {
  if (!template) {
    return '';
  }

  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return props.hasOwnProperty(key) ? props[key] : match;
  });
}

/**
 * Apply variant overrides to component
 */
export function applyVariant(component, variant) {
  if (!variant) {
    return component;
  }

  const result = { ...component };

  // Parse variant props
  let variantProps = {};
  try {
    variantProps = typeof variant.props === 'string'
      ? JSON.parse(variant.props)
      : variant.props || {};
  } catch (e) {
    variantProps = {};
  }

  // Merge props
  const baseProps = typeof component.props === 'string'
    ? JSON.parse(component.props)
    : component.props || {};

  result.props = { ...baseProps, ...variantProps };

  // Override HTML if variant provides it
  if (variant.html_override) {
    result.html = variant.html_override;
  }

  // Override CSS if variant provides it
  if (variant.css_override) {
    result.css = variant.css_override;
  }

  // Override JS if variant provides it
  if (variant.js_override) {
    result.js = variant.js_override;
  }

  return result;
}

/**
 * Render component with props and variant
 */
export function renderComponent(component, customProps = {}, variant = null) {
  // Apply variant first
  const workingComponent = variant
    ? applyVariant(component, variant)
    : component;

  // Parse default props
  const defaultProps = typeof workingComponent.props === 'string'
    ? JSON.parse(workingComponent.props)
    : workingComponent.props || {};

  // Merge with custom props
  const finalProps = { ...defaultProps, ...customProps };

  // Render templates
  return {
    html: renderTemplate(workingComponent.html, finalProps),
    css: workingComponent.css || '',
    js: workingComponent.js || '',
    props: finalProps,
  };
}

/**
 * Generate complete standalone code
 */
export function generateStandaloneCode(component, customProps = {}, variant = null) {
  const rendered = renderComponent(component, customProps, variant);

  return `<!-- ${component.name} -->
${rendered.html}

<style>
${rendered.css}
</style>

${rendered.js ? `<script>\n${rendered.js}\n</script>` : ''}`;
}

/**
 * Combine multiple components into a layout
 */
export function combineComponents(components, layout = 'stack') {
  if (components.length === 0) {
    return '';
  }

  const componentCodes = components.map((comp) => {
    const rendered = renderComponent(comp.component, comp.props || {}, comp.variant);
    return {
      html: rendered.html,
      css: rendered.css,
      js: rendered.js,
      name: comp.component.name,
    };
  });

  // Combine HTML based on layout
  let combinedHtml = '';
  if (layout === 'stack') {
    combinedHtml = componentCodes.map((c) => c.html).join('\n\n');
  } else if (layout === 'grid') {
    combinedHtml = `<div class="component-grid">\n${componentCodes
      .map((c) => `  <div class="grid-item">\n    ${c.html}\n  </div>`)
      .join('\n')}\n</div>`;
  } else if (layout === 'flex') {
    combinedHtml = `<div class="component-flex">\n${componentCodes
      .map((c) => `  <div class="flex-item">\n    ${c.html}\n  </div>`)
      .join('\n')}\n</div>`;
  }

  // Combine CSS
  const combinedCss = componentCodes
    .map((c) => `/* ${c.name} styles */\n${c.css}`)
    .join('\n\n');

  // Combine JS
  const combinedJs = componentCodes
    .filter((c) => c.js)
    .map((c) => `// ${c.name} script\n${c.js}`)
    .join('\n\n');

  return `${combinedHtml}

<style>
${layout === 'grid' ? `
.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}
` : ''}
${layout === 'flex' ? `
.component-flex {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
` : ''}

${combinedCss}
</style>

${combinedJs ? `<script>\n${combinedJs}\n</script>` : ''}`;
}

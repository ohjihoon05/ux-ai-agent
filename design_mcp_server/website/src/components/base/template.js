/**
 * Component Template Engine
 * Handles component rendering with prop substitution
 */

/**
 * Replace template variables with values
 * @param {string} template - Template string with {{variable}} syntax
 * @param {Object} props - Object containing variable values
 * @returns {string} Rendered template
 */
export function renderTemplate(template, props = {}) {
  if (!template) return '';

  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return props[key] !== undefined ? props[key] : match;
  });
}

/**
 * Create a component instance
 * @param {Object} component - Component definition
 * @param {Object} props - Component properties
 * @returns {Object} Rendered component
 */
export function createComponent(component, props = {}) {
  const mergedProps = {
    ...JSON.parse(component.props || '{}'),
    ...props
  };

  return {
    html: renderTemplate(component.html, mergedProps),
    css: component.css,
    js: component.js,
    props: mergedProps
  };
}

/**
 * Apply variant to component
 * @param {Object} component - Component definition
 * @param {Object} variant - Variant definition
 * @param {Object} props - Additional properties
 * @returns {Object} Component with variant applied
 */
export function applyVariant(component, variant, props = {}) {
  const variantProps = JSON.parse(variant.props_overrides || '{}');
  const mergedProps = {
    ...JSON.parse(component.props || '{}'),
    ...variantProps,
    ...props
  };

  return {
    html: renderTemplate(component.html, mergedProps),
    css: component.css + '\n' + (variant.css_overrides || ''),
    js: component.js,
    props: mergedProps,
    variant: variant.name
  };
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} html - HTML string
 * @returns {string} Sanitized HTML
 */
export function sanitizeHTML(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Render component to DOM element
 * @param {HTMLElement} element - Target element
 * @param {Object} renderedComponent - Rendered component object
 */
export function renderToDOM(element, renderedComponent) {
  if (!element) return;

  // Create style element for component CSS
  const styleId = `component-style-${Date.now()}`;
  let styleElement = document.getElementById(styleId);

  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }

  styleElement.textContent = renderedComponent.css;

  // Render HTML
  element.innerHTML = renderedComponent.html;

  // Execute JavaScript if present
  if (renderedComponent.js) {
    try {
      const script = new Function(renderedComponent.js);
      script();
    } catch (error) {
      console.error('Error executing component JavaScript:', error);
    }
  }
}

/**
 * Get component full code (HTML + CSS + JS)
 * @param {Object} renderedComponent - Rendered component
 * @returns {Object} Complete code object
 */
export function getComponentCode(renderedComponent) {
  return {
    html: renderedComponent.html,
    css: renderedComponent.css,
    js: renderedComponent.js || '',
    combined: `
<!-- HTML -->
${renderedComponent.html}

<style>
${renderedComponent.css}
</style>

${renderedComponent.js ? `<script>\n${renderedComponent.js}\n</script>` : ''}
    `.trim()
  };
}

export default {
  renderTemplate,
  createComponent,
  applyVariant,
  sanitizeHTML,
  renderToDOM,
  getComponentCode
};

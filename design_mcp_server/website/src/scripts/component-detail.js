/**
 * Component Detail Page Script
 * Handles component preview, variants, and code copying
 */

import { $, $$, createElement, copyToClipboard, showToast } from './utils.js';
import { renderToDOM, applyVariant, getComponentCode } from '../components/base/template.js';

// State
let currentComponent = null;
let currentVariant = null;

/**
 * Initialize component detail page
 */
async function init() {
  console.log('📦 Loading component details...');

  // Get component ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const componentId = urlParams.get('id');

  if (!componentId) {
    showToast('Component ID not found', 'error');
    return;
  }

  try {
    // Load component
    await loadComponent(componentId);

    // Setup event listeners
    setupEventListeners();

    console.log('✅ Component loaded');
  } catch (error) {
    console.error('❌ Failed to load component:', error);
    showToast('Failed to load component', 'error');
  }
}

/**
 * Load component data
 * @param {number} componentId - Component ID
 */
async function loadComponent(componentId) {
  try {
    const response = await fetch(`/api/components/${componentId}`);
    if (!response.ok) {
      throw new Error('Component not found');
    }

    currentComponent = await response.json();

    // Render component info
    renderComponentInfo();

    // Render preview
    renderPreview();

    // Render variants
    renderVariants();

    // Render code
    renderCode();

    // Track view
    await trackView(componentId);
  } catch (error) {
    console.error('Failed to load component:', error);
    throw error;
  }
}

/**
 * Render component information
 */
function renderComponentInfo() {
  const nameEl = $('#component-name');
  const descEl = $('#component-description');
  const propsEl = $('#component-props');

  if (nameEl) nameEl.textContent = currentComponent.name;
  if (descEl) descEl.textContent = currentComponent.description;

  // Render props
  if (propsEl && currentComponent.props) {
    try {
      const props = JSON.parse(currentComponent.props);
      propsEl.innerHTML = '';

      Object.entries(props).forEach(([key, value]) => {
        const propItem = createElement('div', {
          className: 'flex justify-between py-2 border-b border-gray-200'
        });

        propItem.innerHTML = `
          <span class="font-mono text-sm text-purple-600">${key}</span>
          <span class="text-sm text-gray-600">${value}</span>
        `;

        propsEl.appendChild(propItem);
      });
    } catch (e) {
      console.error('Failed to parse props:', e);
    }
  }
}

/**
 * Render component preview
 */
function renderPreview() {
  const previewEl = $('#component-preview');
  if (!previewEl) return;

  try {
    // Parse props
    const props = JSON.parse(currentComponent.props || '{}');

    // Render HTML with props
    const html = currentComponent.html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return props[key] !== undefined ? props[key] : match;
    });

    previewEl.innerHTML = html;

    // Add CSS
    const styleId = 'preview-style';
    let styleEl = document.getElementById(styleId);

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = currentComponent.css;

    // Execute JS if present
    if (currentComponent.js) {
      try {
        const script = new Function(currentComponent.js);
        script();
      } catch (e) {
        console.error('Failed to execute component JS:', e);
      }
    }

    // Track preview
    trackPreview(currentComponent.id);
  } catch (error) {
    console.error('Failed to render preview:', error);
    previewEl.innerHTML = '<p class="text-red-500">Preview failed to load</p>';
  }
}

/**
 * Render component variants
 */
function renderVariants() {
  const variantsEl = $('#variant-selector');
  if (!variantsEl || !currentComponent.variants || currentComponent.variants.length === 0) {
    if (variantsEl) {
      variantsEl.innerHTML = '<p class="text-gray-500 text-sm">No variants available</p>';
    }
    return;
  }

  variantsEl.innerHTML = '';

  currentComponent.variants.forEach(variant => {
    const button = createElement('button', {
      className: 'px-4 py-2 rounded-lg border-2 border-purple-300 hover:border-purple-600 hover:bg-purple-50 transition-all',
      onclick: () => applyVariantToPreview(variant)
    }, variant.name);

    variantsEl.appendChild(button);
  });
}

/**
 * Apply variant to preview
 * @param {Object} variant - Variant data
 */
function applyVariantToPreview(variant) {
  currentVariant = variant;

  const previewEl = $('#component-preview');
  if (!previewEl) return;

  try {
    // Parse props
    const baseProps = JSON.parse(currentComponent.props || '{}');
    const variantProps = JSON.parse(variant.props_overrides || '{}');
    const mergedProps = { ...baseProps, ...variantProps };

    // Render HTML with merged props
    const html = currentComponent.html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return mergedProps[key] !== undefined ? mergedProps[key] : match;
    });

    previewEl.innerHTML = html;

    // Update CSS with overrides
    const styleEl = document.getElementById('preview-style');
    if (styleEl) {
      styleEl.textContent = currentComponent.css + '\n' + (variant.css_overrides || '');
    }

    // Update code display
    renderCode(variant);

    showToast(`Variant "${variant.name}" applied`, 'success');
  } catch (error) {
    console.error('Failed to apply variant:', error);
    showToast('Failed to apply variant', 'error');
  }
}

/**
 * Render code blocks
 * @param {Object} variant - Optional variant
 */
function renderCode(variant = null) {
  const htmlEl = $('#code-html code');
  const cssEl = $('#code-css code');
  const jsEl = $('#code-js code');

  if (!htmlEl || !cssEl || !jsEl) return;

  try {
    // Get props
    const baseProps = JSON.parse(currentComponent.props || '{}');
    let props = baseProps;

    if (variant) {
      const variantProps = JSON.parse(variant.props_overrides || '{}');
      props = { ...baseProps, ...variantProps };
    }

    // Render HTML
    const html = currentComponent.html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return props[key] !== undefined ? props[key] : match;
    });

    htmlEl.textContent = html;

    // Render CSS
    let css = currentComponent.css;
    if (variant && variant.css_overrides) {
      css += '\n\n/* Variant Overrides */\n' + variant.css_overrides;
    }
    cssEl.textContent = css;

    // Render JS
    jsEl.textContent = currentComponent.js || '// No JavaScript required';
  } catch (error) {
    console.error('Failed to render code:', error);
  }
}

/**
 * Copy component code to clipboard
 */
async function copyCode() {
  try {
    // Get current code
    const htmlCode = $('#code-html code').textContent;
    const cssCode = $('#code-css code').textContent;
    const jsCode = $('#code-js code').textContent;

    // Combine code
    const fullCode = `
<!-- HTML -->
${htmlCode}

<style>
${cssCode}
</style>

${jsCode !== '// No JavaScript required' ? `<script>\n${jsCode}\n</script>` : ''}
    `.trim();

    // Copy to clipboard
    const success = await copyToClipboard(fullCode);

    if (success) {
      showToast('✓ Code copied to clipboard!', 'success');

      // Show success message
      const successEl = $('#copy-success');
      if (successEl) {
        successEl.classList.remove('hidden');
        setTimeout(() => {
          successEl.classList.add('hidden');
        }, 3000);
      }

      // Track copy
      await trackCopy(currentComponent.id, currentVariant?.id);

      // Increment usage count
      await fetch(`/api/components/${currentComponent.id}/copy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: currentVariant?.id
        })
      });
    } else {
      showToast('Failed to copy code', 'error');
    }
  } catch (error) {
    console.error('Failed to copy code:', error);
    showToast('Failed to copy code', 'error');
  }
}

/**
 * Track component view
 * @param {number} componentId - Component ID
 */
async function trackView(componentId) {
  try {
    await fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'view',
        componentId
      })
    });
  } catch (error) {
    console.error('Failed to track view:', error);
  }
}

/**
 * Track component preview
 * @param {number} componentId - Component ID
 */
async function trackPreview(componentId) {
  try {
    await fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'preview',
        componentId
      })
    });
  } catch (error) {
    console.error('Failed to track preview:', error);
  }
}

/**
 * Track component copy
 * @param {number} componentId - Component ID
 * @param {number} variantId - Variant ID
 */
async function trackCopy(componentId, variantId = null) {
  try {
    await fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'copy',
        componentId,
        variantId
      })
    });
  } catch (error) {
    console.error('Failed to track copy:', error);
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Copy button
  const copyBtn = $('#copy-button');
  if (copyBtn) {
    copyBtn.addEventListener('click', copyCode);
  }

  // Code tabs
  $$('.code-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      switchCodeTab(tabName);
    });
  });
}

/**
 * Switch code tab
 * @param {string} tabName - Tab name (html, css, js)
 */
function switchCodeTab(tabName) {
  // Update tab buttons
  $$('.code-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });

  // Update code blocks
  $$('.code-block').forEach(block => {
    block.classList.toggle('active', block.id === `code-${tabName}`);
    block.classList.toggle('hidden', block.id !== `code-${tabName}`);
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

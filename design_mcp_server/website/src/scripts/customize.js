/**
 * Customization Page Script
 * Handles real-time component customization
 */

import { $, showToast } from './utils.js';

// State
let currentComponent = null;
let currentVariant = null;
let currentCustomization = {
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#4facfe',
    text: '#ffffff'
  },
  size: {
    preset: 'md',
    width: 0, // 0 = auto
    height: 0, // 0 = auto
    fontSize: 16
  },
  spacing: {
    padding: 16,
    margin: 0,
    borderRadius: 8,
    borderWidth: 0
  },
  advanced: {
    shadow: 5,
    opacity: 100,
    darkMode: false
  }
};

let currentCodeTab = 'html';

/**
 * Initialize customization page
 */
async function init() {
  console.log('🎨 Initializing Customization Page...');

  try {
    // Load saved customization from localStorage
    loadSavedCustomization();

    // Load components
    await loadComponents();

    // Setup event listeners
    setupEventListeners();

    // Check if component ID in URL
    const urlParams = new URLSearchParams(window.location.search);
    const componentId = urlParams.get('id');
    if (componentId) {
      $('#component-select').value = componentId;
      await loadComponent(componentId);
    }

    console.log('✅ Customization page initialized');
  } catch (error) {
    console.error('❌ Failed to initialize:', error);
    showToast('Failed to load customization page', 'error');
  }
}

/**
 * Load all components into selector
 */
async function loadComponents() {
  try {
    const response = await fetch('/api/components');
    const data = await response.json();

    const select = $('#component-select');
    data.components.forEach(component => {
      const option = document.createElement('option');
      option.value = component.id;
      option.textContent = component.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to load components:', error);
  }
}

/**
 * Load component and its variants
 */
async function loadComponent(componentId) {
  try {
    const response = await fetch(`/api/components/${componentId}`);
    currentComponent = await response.json();

    // Load variants
    await loadVariants(componentId);

    // Enable controls
    $('#variant-select').disabled = false;
    $('#preset-select').disabled = false;
    $('#save-preset-btn').disabled = false;
    $('#export-code-btn').disabled = false;

    // Update preview
    updatePreview();
    updateCode();

    console.log('✅ Loaded component:', currentComponent.name);
  } catch (error) {
    console.error('Failed to load component:', error);
    showToast('Failed to load component', 'error');
  }
}

/**
 * Load variants for component
 */
async function loadVariants(componentId) {
  try {
    const response = await fetch(`/api/components/${componentId}/variants`);
    const variants = await response.json();

    const select = $('#variant-select');
    select.innerHTML = '<option value="">기본 (Default)</option>';

    variants.forEach(variant => {
      const option = document.createElement('option');
      option.value = variant.id;
      option.textContent = variant.name;
      select.appendChild(option);
    });

    // Load presets
    await loadPresets(componentId);
  } catch (error) {
    console.error('Failed to load variants:', error);
  }
}

/**
 * Load presets for component
 */
async function loadPresets(componentId) {
  try {
    const response = await fetch(`/api/components/${componentId}/presets`);
    const presets = await response.json();

    const select = $('#preset-select');
    select.innerHTML = '<option value="">프리셋 선택...</option>';

    presets.forEach(preset => {
      const option = document.createElement('option');
      option.value = preset.id;
      option.textContent = preset.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to load presets:', error);
  }
}

/**
 * Load and apply variant
 */
async function loadVariant(variantId) {
  if (!variantId) {
    currentVariant = null;
    updatePreview();
    return;
  }

  try {
    const response = await fetch(`/api/variants/${variantId}`);
    currentVariant = await response.json();
    updatePreview();
    updateCode();
    console.log('✅ Loaded variant:', currentVariant.name);
  } catch (error) {
    console.error('Failed to load variant:', error);
  }
}

/**
 * Load and apply preset
 */
async function loadPreset(presetId) {
  if (!presetId) return;

  try {
    const response = await fetch(`/api/presets/${presetId}`);
    const preset = await response.json();

    // Parse customization JSON
    const customization = JSON.parse(preset.customization);
    currentCustomization = customization;

    // Update all controls
    applyCustomizationToControls();
    updatePreview();
    updateCode();

    showToast(`프리셋 "${preset.name}" 로드됨`, 'success');
  } catch (error) {
    console.error('Failed to load preset:', error);
    showToast('Failed to load preset', 'error');
  }
}

/**
 * Apply customization to control inputs
 */
function applyCustomizationToControls() {
  const c = currentCustomization;

  // Colors
  $('#primary-color').value = c.colors.primary;
  $('#primary-color-hex').value = c.colors.primary;
  $('#secondary-color').value = c.colors.secondary;
  $('#secondary-color-hex').value = c.colors.secondary;
  $('#accent-color').value = c.colors.accent;
  $('#accent-color-hex').value = c.colors.accent;
  $('#text-color').value = c.colors.text;
  $('#text-color-hex').value = c.colors.text;

  // Size
  $('#size-select').value = c.size.preset;
  $('#width-slider').value = c.size.width;
  $('#height-slider').value = c.size.height;
  $('#font-size-slider').value = c.size.fontSize;
  updateSliderDisplay('width', c.size.width);
  updateSliderDisplay('height', c.size.height);
  updateSliderDisplay('font-size', c.size.fontSize);

  // Spacing
  $('#padding-slider').value = c.spacing.padding;
  $('#margin-slider').value = c.spacing.margin;
  $('#radius-slider').value = c.spacing.borderRadius;
  $('#border-width-slider').value = c.spacing.borderWidth;
  updateSliderDisplay('padding', c.spacing.padding);
  updateSliderDisplay('margin', c.spacing.margin);
  updateSliderDisplay('radius', c.spacing.borderRadius);
  updateSliderDisplay('border-width', c.spacing.borderWidth);

  // Advanced
  $('#shadow-slider').value = c.advanced.shadow;
  $('#opacity-slider').value = c.advanced.opacity;

  const darkToggle = $('#dark-mode-toggle');
  if (c.advanced.darkMode) {
    darkToggle.classList.add('bg-purple-600');
    darkToggle.querySelector('span').classList.add('translate-x-6');
  } else {
    darkToggle.classList.remove('bg-purple-600');
    darkToggle.querySelector('span').classList.remove('translate-x-6');
  }
}

/**
 * Update preview with current customization
 */
function updatePreview() {
  if (!currentComponent) return;

  const preview = $('#live-preview');
  const c = currentCustomization;

  // Get component HTML
  let html = currentVariant?.html_override || currentComponent.html;
  let css = currentVariant?.css_override || currentComponent.css || '';

  // Parse and apply props
  let props = {};
  try {
    const componentProps = JSON.parse(currentComponent.props || '{}');
    const variantProps = currentVariant ? JSON.parse(currentVariant.props || '{}') : {};
    props = { ...componentProps, ...variantProps };
  } catch (e) {
    console.warn('Failed to parse props:', e);
  }

  // Replace template variables
  html = html.replace(/\{\{(\w+)\}\}/g, (match, key) => props[key] || match);

  // Generate custom CSS
  const customCSS = generateCustomCSS(c);

  // Combine CSS
  const fullCSS = css + '\n' + customCSS;

  // Update preview
  preview.innerHTML = `
    <style>${fullCSS}</style>
    <div class="component-preview-container" style="
      ${c.size.width > 0 ? `max-width: ${c.size.width}px;` : ''}
    ">
      ${html}
    </div>
  `;

  // Show code section
  $('#code-section').style.display = 'block';

  // Save to localStorage
  saveCustomization();
}

/**
 * Generate custom CSS from customization
 */
function generateCustomCSS(c) {
  const width = c.size.width > 0 ? `${c.size.width}px` : 'auto';
  const height = c.size.height > 0 ? `${c.size.height}px` : 'auto';

  let shadowValue = 'none';
  if (c.advanced.shadow > 0) {
    const intensity = c.advanced.shadow * 4;
    shadowValue = `0 ${intensity}px ${intensity * 2}px rgba(0, 0, 0, 0.${c.advanced.shadow})`;
  }

  return `
    .component-preview-container > * {
      --color-primary: ${c.colors.primary};
      --color-secondary: ${c.colors.secondary};
      --color-accent: ${c.colors.accent};
      --color-text: ${c.colors.text};

      background: linear-gradient(135deg, ${c.colors.primary} 0%, ${c.colors.secondary} 100%);
      color: ${c.colors.text};

      ${width !== 'auto' ? `width: ${width} !important;` : ''}
      ${height !== 'auto' ? `height: ${height} !important;` : ''}
      font-size: ${c.size.fontSize}px !important;

      padding: ${c.spacing.padding}px !important;
      margin: ${c.spacing.margin}px !important;
      border-radius: ${c.spacing.borderRadius}px !important;
      ${c.spacing.borderWidth > 0 ? `border: ${c.spacing.borderWidth}px solid ${c.colors.accent} !important;` : ''}

      box-shadow: ${shadowValue} !important;
      opacity: ${c.advanced.opacity / 100};
    }

    ${c.advanced.darkMode ? `
      .component-preview-container {
        background: #1a1a1a;
        color: #ffffff;
      }
      .component-preview-container > * {
        filter: invert(1) hue-rotate(180deg);
      }
    ` : ''}
  `;
}

/**
 * Update code display
 */
function updateCode() {
  if (!currentComponent) return;

  const codeContent = $('#code-content');
  const c = currentCustomization;

  let code = '';

  switch (currentCodeTab) {
    case 'html':
      let html = currentVariant?.html_override || currentComponent.html;
      let props = {};
      try {
        const componentProps = JSON.parse(currentComponent.props || '{}');
        const variantProps = currentVariant ? JSON.parse(currentVariant.props || '{}') : {};
        props = { ...componentProps, ...variantProps };
      } catch (e) {}
      code = html.replace(/\{\{(\w+)\}\}/g, (match, key) => props[key] || match);
      break;

    case 'css':
      const baseCss = currentVariant?.css_override || currentComponent.css || '';
      const customCss = generateCustomCSS(c);
      code = baseCss + '\n\n/* Custom Styles */\n' + customCss;
      break;

    case 'js':
      code = currentVariant?.js_override || currentComponent.js || '// No JavaScript for this component';
      break;
  }

  codeContent.textContent = code;
}

/**
 * Update slider value display
 */
function updateSliderDisplay(type, value) {
  const displays = {
    'width': () => value === 0 ? 'auto' : `${value}px`,
    'height': () => value === 0 ? 'auto' : `${value}px`,
    'font-size': () => `${value}px`,
    'padding': () => `${value}px`,
    'margin': () => `${value}px`,
    'radius': () => `${value}px`,
    'border-width': () => `${value}px`
  };

  const displayElement = $(`#${type}-value`);
  if (displayElement && displays[type]) {
    displayElement.textContent = displays[type]();
  }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Component selection
  $('#component-select').addEventListener('change', (e) => {
    if (e.target.value) {
      loadComponent(e.target.value);
    }
  });

  // Variant selection
  $('#variant-select').addEventListener('change', (e) => {
    loadVariant(e.target.value);
  });

  // Preset selection
  $('#preset-select').addEventListener('change', (e) => {
    loadPreset(e.target.value);
  });

  // Color controls
  setupColorControl('primary');
  setupColorControl('secondary');
  setupColorControl('accent');
  setupColorControl('text');

  // Size controls
  $('#size-select').addEventListener('change', (e) => {
    currentCustomization.size.preset = e.target.value;
    updatePreview();
    updateCode();
  });

  setupSlider('width', 'size', 'width');
  setupSlider('height', 'size', 'height');
  setupSlider('font-size', 'size', 'fontSize');

  // Spacing controls
  setupSlider('padding', 'spacing', 'padding');
  setupSlider('margin', 'spacing', 'margin');
  setupSlider('radius', 'spacing', 'borderRadius');
  setupSlider('border-width', 'spacing', 'borderWidth');

  // Advanced controls
  $('#shadow-slider').addEventListener('input', (e) => {
    currentCustomization.advanced.shadow = parseInt(e.target.value);
    updatePreview();
  });

  $('#opacity-slider').addEventListener('input', (e) => {
    currentCustomization.advanced.opacity = parseInt(e.target.value);
    updatePreview();
  });

  // Dark mode toggle
  $('#dark-mode-toggle').addEventListener('click', () => {
    currentCustomization.advanced.darkMode = !currentCustomization.advanced.darkMode;
    const toggle = $('#dark-mode-toggle');
    toggle.classList.toggle('bg-purple-600');
    toggle.querySelector('span').classList.toggle('translate-x-6');
    updatePreview();
  });

  // Preview mode buttons
  document.querySelectorAll('.preview-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.preview-mode-btn').forEach(b => b.classList.remove('active', 'bg-purple-100', 'text-purple-700'));
      btn.classList.add('active', 'bg-purple-100', 'text-purple-700');

      const mode = btn.dataset.mode;
      const container = $('#preview-container');
      container.dataset.mode = mode;

      // Adjust container width
      const widths = { mobile: '375px', tablet: '768px', desktop: '100%' };
      container.style.maxWidth = widths[mode];
    });
  });

  // Code tab buttons
  document.querySelectorAll('.code-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.code-tab-btn').forEach(b => b.classList.remove('active', 'border-b-2', 'border-purple-600', 'text-purple-600'));
      btn.classList.add('active', 'border-b-2', 'border-purple-600', 'text-purple-600');

      currentCodeTab = btn.dataset.tab;
      updateCode();
    });
  });

  // Copy code button
  $('#copy-code-btn').addEventListener('click', async () => {
    const code = $('#code-content').textContent;
    try {
      await navigator.clipboard.writeText(code);
      showToast('코드가 복사되었습니다!', 'success');
    } catch (error) {
      console.error('Failed to copy:', error);
      showToast('Failed to copy code', 'error');
    }
  });

  // Export code button
  $('#export-code-btn').addEventListener('click', async () => {
    if (!currentComponent) return;

    const fullCode = {
      html: $('#code-content').textContent,
      css: generateCustomCSS(currentCustomization),
      component: currentComponent.name,
      customization: currentCustomization
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(fullCode, null, 2));
      showToast('전체 코드가 복사되었습니다!', 'success');
    } catch (error) {
      console.error('Failed to export:', error);
      showToast('Failed to export code', 'error');
    }
  });

  // Save preset button
  $('#save-preset-btn').addEventListener('click', () => {
    $('#save-preset-modal').classList.remove('hidden');
    $('#save-preset-modal').classList.add('flex');
  });

  // Save preset confirm
  $('#save-preset-confirm').addEventListener('click', async () => {
    const name = $('#preset-name-input').value.trim();
    if (!name) {
      showToast('프리셋 이름을 입력하세요', 'error');
      return;
    }

    try {
      const response = await fetch('/api/presets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          componentId: currentComponent.id,
          name: name,
          description: $('#preset-description-input').value.trim(),
          customization: currentCustomization
        })
      });

      if (response.ok) {
        showToast(`프리셋 "${name}" 저장됨!`, 'success');
        closePresetModal();
        await loadPresets(currentComponent.id);
      }
    } catch (error) {
      console.error('Failed to save preset:', error);
      showToast('Failed to save preset', 'error');
    }
  });

  // Save preset cancel
  $('#save-preset-cancel').addEventListener('click', closePresetModal);

  // Reset button
  $('#reset-btn').addEventListener('click', () => {
    currentCustomization = {
      colors: { primary: '#667eea', secondary: '#764ba2', accent: '#4facfe', text: '#ffffff' },
      size: { preset: 'md', width: 0, height: 0, fontSize: 16 },
      spacing: { padding: 16, margin: 0, borderRadius: 8, borderWidth: 0 },
      advanced: { shadow: 5, opacity: 100, darkMode: false }
    };
    applyCustomizationToControls();
    updatePreview();
    updateCode();
    clearSavedCustomization();
    showToast('초기화되었습니다', 'success');
  });
}

/**
 * Setup color control (picker + hex input)
 */
function setupColorControl(colorName) {
  const picker = $(`#${colorName}-color`);
  const hexInput = $(`#${colorName}-color-hex`);

  picker.addEventListener('input', (e) => {
    const color = e.target.value;
    hexInput.value = color;
    currentCustomization.colors[colorName] = color;
    updatePreview();
    updateCode();
  });

  hexInput.addEventListener('input', (e) => {
    const color = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      picker.value = color;
      currentCustomization.colors[colorName] = color;
      updatePreview();
      updateCode();
    }
  });
}

/**
 * Setup slider control
 */
function setupSlider(sliderId, category, property) {
  const slider = $(`#${sliderId}-slider`);

  slider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    currentCustomization[category][property] = value;
    updateSliderDisplay(sliderId, value);
    updatePreview();
    updateCode();
  });
}

/**
 * Close preset modal
 */
function closePresetModal() {
  $('#save-preset-modal').classList.add('hidden');
  $('#save-preset-modal').classList.remove('flex');
  $('#preset-name-input').value = '';
  $('#preset-description-input').value = '';
}

/**
 * Save customization to localStorage
 */
function saveCustomization() {
  try {
    localStorage.setItem('componentCustomization', JSON.stringify({
      customization: currentCustomization,
      componentId: currentComponent?.id,
      variantId: currentVariant?.id,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Failed to save customization to localStorage:', error);
  }
}

/**
 * Load saved customization from localStorage
 */
function loadSavedCustomization() {
  try {
    const saved = localStorage.getItem('componentCustomization');
    if (saved) {
      const data = JSON.parse(saved);

      // Check if saved data is recent (within 7 days)
      const weekInMs = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - data.timestamp < weekInMs) {
        currentCustomization = data.customization;
        console.log('✅ Loaded saved customization from localStorage');
      } else {
        // Remove old data
        localStorage.removeItem('componentCustomization');
      }
    }
  } catch (error) {
    console.warn('Failed to load customization from localStorage:', error);
  }
}

/**
 * Clear saved customization
 */
function clearSavedCustomization() {
  try {
    localStorage.removeItem('componentCustomization');
  } catch (error) {
    console.warn('Failed to clear customization from localStorage:', error);
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

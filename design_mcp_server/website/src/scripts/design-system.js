/**
 * Design System Manager Script
 * Handles brand design system creation and management
 */

import { $, showToast } from './utils.js';

// State
let currentSystem = {
  id: null,
  name: '',
  description: '',
  colors: { primary: '#667eea', secondary: '#764ba2', accent: '#4facfe' },
  typography: {
    fontFamily: "'Pretendard', -apple-system, sans-serif",
    fontSizes: { xs: '12px', sm: '14px', base: '16px', lg: '18px', xl: '20px' },
    lineHeights: { tight: '1.25', normal: '1.5', relaxed: '1.75' }
  },
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px' },
  borders: {
    radius: { sm: '4px', md: '8px', lg: '16px', xl: '24px' },
    width: { thin: '1px', normal: '2px', thick: '4px' }
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)'
  },
  is_active: false
};

let saveAsActive = true;

/**
 * Initialize design system page
 */
async function init() {
  console.log('🎨 Initializing Design System Manager...');

  try {
    // Load existing systems
    await loadDesignSystems();

    // Render default values
    renderAllInputs();

    // Setup event listeners
    setupEventListeners();

    // Update preview
    updatePreview();

    console.log('✅ Design System Manager initialized');
  } catch (error) {
    console.error('❌ Failed to initialize:', error);
    showToast('Failed to load design system manager', 'error');
  }
}

/**
 * Load all design systems
 */
async function loadDesignSystems() {
  try {
    const response = await fetch('/api/design-systems');
    const systems = await response.json();

    const select = $('#system-select');
    select.innerHTML = '<option value="">새 디자인 시스템 만들기...</option>';

    systems.forEach(system => {
      const option = document.createElement('option');
      option.value = system.id;
      option.textContent = system.name + (system.is_active ? ' (활성)' : '');
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to load design systems:', error);
  }
}

/**
 * Load specific design system
 */
async function loadDesignSystem(id) {
  try {
    const response = await fetch(`/api/design-systems/${id}`);
    const system = await response.json();

    currentSystem = {
      id: system.id,
      name: system.name,
      description: system.description || '',
      colors: JSON.parse(system.colors),
      typography: system.typography ? JSON.parse(system.typography) : currentSystem.typography,
      spacing: system.spacing ? JSON.parse(system.spacing) : currentSystem.spacing,
      borders: system.borders ? JSON.parse(system.borders) : currentSystem.borders,
      shadows: system.shadows ? JSON.parse(system.shadows) : currentSystem.shadows,
      is_active: system.is_active === 1
    };

    // Update UI
    $('#system-name').value = currentSystem.name;
    $('#system-description').value = currentSystem.description;

    const activeToggle = $('#active-toggle');
    if (currentSystem.is_active) {
      activeToggle.classList.add('bg-purple-600');
      activeToggle.querySelector('span').classList.add('translate-x-6');
    } else {
      activeToggle.classList.remove('bg-purple-600');
      activeToggle.querySelector('span').classList.remove('translate-x-6');
    }

    // Enable export and apply buttons
    $('#export-system-btn').disabled = false;
    $('#apply-system-btn').disabled = false;

    renderAllInputs();
    updatePreview();

    showToast(`디자인 시스템 "${currentSystem.name}" 로드됨`, 'success');
  } catch (error) {
    console.error('Failed to load design system:', error);
    showToast('Failed to load design system', 'error');
  }
}

/**
 * Render all input fields
 */
function renderAllInputs() {
  renderColorInputs();
  renderFontSizeInputs();
  renderLineHeightInputs();
  renderSpacingInputs();
  renderBorderRadiusInputs();
  renderBorderWidthInputs();
  renderShadowInputs();
}

/**
 * Render color inputs
 */
function renderColorInputs() {
  const container = $('#color-inputs');
  container.innerHTML = '';

  Object.entries(currentSystem.colors).forEach(([key, value]) => {
    const div = document.createElement('div');
    div.className = 'flex items-center space-x-3';
    div.innerHTML = `
      <input type="color" data-color-key="${key}" value="${value}" class="w-16 h-12 rounded-xl cursor-pointer border-2 border-gray-300">
      <input type="text" data-color-key="${key}" value="${key}" class="flex-1 px-3 py-2 rounded-xl border border-gray-300 bg-white text-sm" placeholder="Color name">
      <input type="text" data-color-hex="${key}" value="${value}" class="w-24 px-3 py-2 rounded-xl border border-gray-300 bg-white text-sm font-mono">
      <button data-remove-color="${key}" class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">🗑️</button>
    `;
    container.appendChild(div);
  });
}

/**
 * Render font size inputs
 */
function renderFontSizeInputs() {
  const container = $('#font-size-inputs');
  container.innerHTML = '';

  Object.entries(currentSystem.typography.fontSizes).forEach(([key, value]) => {
    const div = document.createElement('div');
    div.className = 'flex items-center space-x-3';
    div.innerHTML = `
      <input type="text" data-fontsize-key="${key}" value="${key}" class="w-20 px-3 py-2 rounded-xl border border-gray-300 bg-white text-sm" placeholder="Size">
      <input type="text" data-fontsize-value="${key}" value="${value}" class="flex-1 px-3 py-2 rounded-xl border border-gray-300 bg-white text-sm font-mono">
      <button data-remove-fontsize="${key}" class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">🗑️</button>
    `;
    container.appendChild(div);
  });
}

/**
 * Render line height inputs
 */
function renderLineHeightInputs() {
  const container = $('#line-height-inputs');
  container.innerHTML = '';

  Object.entries(currentSystem.typography.lineHeights).forEach(([key, value]) => {
    const div = document.createElement('div');
    div.className = 'flex items-center space-x-3';
    div.innerHTML = `
      <input type="text" data-lineheight-key="${key}" value="${key}" class="w-20 px-3 py-2 rounded-xl border border-gray-300 bg-white text-sm" placeholder="Size">
      <input type="text" data-lineheight-value="${key}" value="${value}" class="flex-1 px-3 py-2 rounded-xl border border-gray-300 bg-white text-sm font-mono">
      <button data-remove-lineheight="${key}" class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">🗑️</button>
    `;
    container.appendChild(div);
  });
}

/**
 * Render spacing inputs
 */
function renderSpacingInputs() {
  const container = $('#spacing-inputs');
  container.innerHTML = '';

  Object.entries(currentSystem.spacing).forEach(([key, value]) => {
    const div = document.createElement('div');
    div.className = 'flex items-center space-x-3';
    div.innerHTML = `
      <input type="text" data-spacing-key="${key}" value="${key}" class="w-20 px-3 py-2 rounded-xl border border-gray-300 bg-white text-sm" placeholder="Size">
      <input type="text" data-spacing-value="${key}" value="${value}" class="flex-1 px-3 py-2 rounded-xl border border-gray-300 bg-white text-sm font-mono">
      <button data-remove-spacing="${key}" class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">🗑️</button>
    `;
    container.appendChild(div);
  });
}

/**
 * Render border radius inputs
 */
function renderBorderRadiusInputs() {
  const container = $('#border-radius-inputs');
  container.innerHTML = '';

  Object.entries(currentSystem.borders.radius).forEach(([key, value]) => {
    const div = document.createElement('div');
    div.className = 'flex items-center space-x-3';
    div.innerHTML = `
      <input type="text" data-radius-key="${key}" value="${key}" class="w-20 px-3 py-2 rounded-xl border border-gray-300 bg-white text-sm" placeholder="Size">
      <input type="text" data-radius-value="${key}" value="${value}" class="flex-1 px-3 py-2 rounded-xl border border-gray-300 bg-white text-sm font-mono">
      <button data-remove-radius="${key}" class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">🗑️</button>
    `;
    container.appendChild(div);
  });
}

/**
 * Render border width inputs
 */
function renderBorderWidthInputs() {
  const container = $('#border-width-inputs');
  container.innerHTML = '';

  Object.entries(currentSystem.borders.width).forEach(([key, value]) => {
    const div = document.createElement('div');
    div.className = 'flex items-center space-x-3';
    div.innerHTML = `
      <input type="text" data-borderwidth-key="${key}" value="${key}" class="w-20 px-3 py-2 rounded-xl border border-gray-300 bg-white text-sm" placeholder="Size">
      <input type="text" data-borderwidth-value="${key}" value="${value}" class="flex-1 px-3 py-2 rounded-xl border border-gray-300 bg-white text-sm font-mono">
      <button data-remove-borderwidth="${key}" class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">🗑️</button>
    `;
    container.appendChild(div);
  });
}

/**
 * Render shadow inputs
 */
function renderShadowInputs() {
  const container = $('#shadow-inputs');
  container.innerHTML = '';

  Object.entries(currentSystem.shadows).forEach(([key, value]) => {
    const div = document.createElement('div');
    div.className = 'flex items-center space-x-3 mb-2';
    div.innerHTML = `
      <input type="text" data-shadow-key="${key}" value="${key}" class="w-20 px-3 py-2 rounded-xl border border-gray-300 bg-white text-sm" placeholder="Size">
      <input type="text" data-shadow-value="${key}" value="${value}" class="flex-1 px-3 py-2 rounded-xl border border-gray-300 bg-white text-sm font-mono">
      <button data-remove-shadow="${key}" class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">🗑️</button>
    `;
    container.appendChild(div);
  });
}

/**
 * Generate CSS variables
 */
function generateCSSVariables() {
  const lines = [':root {'];

  // Colors
  Object.entries(currentSystem.colors).forEach(([key, value]) => {
    lines.push(`  --color-${key}: ${value};`);
  });

  // Typography
  lines.push(`  --font-family: ${currentSystem.typography.fontFamily};`);
  Object.entries(currentSystem.typography.fontSizes).forEach(([key, value]) => {
    lines.push(`  --font-size-${key}: ${value};`);
  });
  Object.entries(currentSystem.typography.lineHeights).forEach(([key, value]) => {
    lines.push(`  --line-height-${key}: ${value};`);
  });

  // Spacing
  Object.entries(currentSystem.spacing).forEach(([key, value]) => {
    lines.push(`  --spacing-${key}: ${value};`);
  });

  // Borders
  Object.entries(currentSystem.borders.radius).forEach(([key, value]) => {
    lines.push(`  --border-radius-${key}: ${value};`);
  });
  Object.entries(currentSystem.borders.width).forEach(([key, value]) => {
    lines.push(`  --border-width-${key}: ${value};`);
  });

  // Shadows
  Object.entries(currentSystem.shadows).forEach(([key, value]) => {
    lines.push(`  --shadow-${key}: ${value};`);
  });

  lines.push('}');

  return lines.join('\n');
}

/**
 * Update preview
 */
function updatePreview() {
  // Update CSS output
  const css = generateCSSVariables();
  $('#css-output').textContent = css;

  // Apply to preview components
  const style = document.createElement('style');
  style.textContent = css + `
    .preview-component {
      font-family: var(--font-family);
      font-size: var(--font-size-base);
      line-height: var(--line-height-normal);
    }
    .preview-component:first-child {
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-md);
    }
    .preview-component:nth-child(2) {
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-sm);
      padding: var(--spacing-md);
    }
    .preview-component:last-child {
      border-radius: var(--border-radius-md);
      border: var(--border-width-normal) solid var(--color-primary);
    }
  `;

  // Remove old style
  const oldStyle = document.querySelector('#preview-style');
  if (oldStyle) oldStyle.remove();

  style.id = 'preview-style';
  document.head.appendChild(style);
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // System selection
  $('#system-select').addEventListener('change', (e) => {
    if (e.target.value) {
      loadDesignSystem(e.target.value);
    } else {
      // Reset to new system
      currentSystem = {
        id: null,
        name: '',
        description: '',
        colors: { primary: '#667eea', secondary: '#764ba2', accent: '#4facfe' },
        typography: {
          fontFamily: "'Pretendard', -apple-system, sans-serif",
          fontSizes: { xs: '12px', sm: '14px', base: '16px', lg: '18px', xl: '20px' },
          lineHeights: { tight: '1.25', normal: '1.5', relaxed: '1.75' }
        },
        spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px' },
        borders: {
          radius: { sm: '4px', md: '8px', lg: '16px', xl: '24px' },
          width: { thin: '1px', normal: '2px', thick: '4px' }
        },
        shadows: {
          sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
          md: '0 4px 6px rgba(0, 0, 0, 0.1)',
          lg: '0 10px 15px rgba(0, 0, 0, 0.1)'
        },
        is_active: false
      };
      $('#system-name').value = '';
      $('#system-description').value = '';
      $('#export-system-btn').disabled = true;
      $('#apply-system-btn').disabled = true;
      renderAllInputs();
      updatePreview();
    }
  });

  // Font family
  $('#font-family').addEventListener('input', (e) => {
    currentSystem.typography.fontFamily = e.target.value;
    updatePreview();
  });

  // Active toggle
  $('#active-toggle').addEventListener('click', () => {
    currentSystem.is_active = !currentSystem.is_active;
    const toggle = $('#active-toggle');
    toggle.classList.toggle('bg-purple-600');
    toggle.querySelector('span').classList.toggle('translate-x-6');
  });

  // Dynamic inputs (colors, spacing, etc.)
  setupDynamicInputListeners();

  // Add buttons
  $('#add-color-btn').addEventListener('click', () => {
    const key = `color${Object.keys(currentSystem.colors).length + 1}`;
    currentSystem.colors[key] = '#000000';
    renderColorInputs();
    setupDynamicInputListeners();
  });

  $('#add-spacing-btn').addEventListener('click', () => {
    const key = `spacing${Object.keys(currentSystem.spacing).length + 1}`;
    currentSystem.spacing[key] = '0px';
    renderSpacingInputs();
    setupDynamicInputListeners();
  });

  $('#add-shadow-btn').addEventListener('click', () => {
    const key = `shadow${Object.keys(currentSystem.shadows).length + 1}`;
    currentSystem.shadows[key] = '0 0 0 rgba(0, 0, 0, 0)';
    renderShadowInputs();
    setupDynamicInputListeners();
  });

  // Save button
  $('#save-system-btn').addEventListener('click', () => {
    $('#save-system-modal').classList.remove('hidden');
    $('#save-system-modal').classList.add('flex');
  });

  // Save modal
  $('#save-active-toggle').addEventListener('click', () => {
    saveAsActive = !saveAsActive;
    const toggle = $('#save-active-toggle');
    if (saveAsActive) {
      toggle.classList.add('bg-purple-600');
      toggle.querySelector('span').classList.add('translate-x-6');
    } else {
      toggle.classList.remove('bg-purple-600');
      toggle.querySelector('span').classList.remove('translate-x-6');
    }
  });

  $('#save-system-confirm').addEventListener('click', saveDesignSystem);
  $('#save-system-cancel').addEventListener('click', closeSaveModal);

  // Export button
  $('#export-system-btn').addEventListener('click', exportDesignSystem);

  // Import button
  $('#import-system-btn').addEventListener('click', () => {
    $('#import-modal').classList.remove('hidden');
    $('#import-modal').classList.add('flex');
  });

  $('#import-confirm').addEventListener('click', importDesignSystem);
  $('#import-cancel').addEventListener('click', closeImportModal);

  $('#import-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        $('#import-json').value = event.target.result;
      };
      reader.readAsText(file);
    }
  });

  // Copy CSS button
  $('#copy-css-btn').addEventListener('click', async () => {
    const css = $('#css-output').textContent;
    try {
      await navigator.clipboard.writeText(css);
      showToast('CSS가 복사되었습니다!', 'success');
    } catch (error) {
      console.error('Failed to copy:', error);
      showToast('Failed to copy CSS', 'error');
    }
  });

  // Apply system button
  $('#apply-system-btn').addEventListener('click', applyToComponents);
}

/**
 * Setup dynamic input listeners
 */
function setupDynamicInputListeners() {
  // Color inputs
  document.querySelectorAll('[data-color-key]').forEach(input => {
    if (input.type === 'color') {
      input.addEventListener('input', (e) => {
        const key = e.target.dataset.colorKey;
        currentSystem.colors[key] = e.target.value;
        document.querySelector(`[data-color-hex="${key}"]`).value = e.target.value;
        updatePreview();
      });
    } else if (input.dataset.colorKey) {
      input.addEventListener('change', (e) => {
        const oldKey = e.target.dataset.colorKey;
        const newKey = e.target.value;
        if (newKey && newKey !== oldKey) {
          currentSystem.colors[newKey] = currentSystem.colors[oldKey];
          delete currentSystem.colors[oldKey];
          renderColorInputs();
          setupDynamicInputListeners();
          updatePreview();
        }
      });
    }
  });

  document.querySelectorAll('[data-color-hex]').forEach(input => {
    input.addEventListener('input', (e) => {
      const key = e.target.dataset.colorHex;
      const value = e.target.value;
      if (/^#[0-9A-F]{6}$/i.test(value)) {
        currentSystem.colors[key] = value;
        document.querySelector(`[data-color-key="${key}"][type="color"]`).value = value;
        updatePreview();
      }
    });
  });

  document.querySelectorAll('[data-remove-color]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const key = e.target.dataset.removeColor;
      delete currentSystem.colors[key];
      renderColorInputs();
      setupDynamicInputListeners();
      updatePreview();
    });
  });

  // Similar listeners for other inputs (font sizes, spacing, etc.)
  setupValueInputs('fontsize', 'typography.fontSizes');
  setupValueInputs('lineheight', 'typography.lineHeights');
  setupValueInputs('spacing', 'spacing');
  setupValueInputs('radius', 'borders.radius');
  setupValueInputs('borderwidth', 'borders.width');
  setupValueInputs('shadow', 'shadows');
}

/**
 * Setup value input listeners (generic)
 */
function setupValueInputs(prefix, path) {
  const pathParts = path.split('.');
  const obj = pathParts.length === 1
    ? currentSystem[pathParts[0]]
    : currentSystem[pathParts[0]][pathParts[1]];

  document.querySelectorAll(`[data-${prefix}-value]`).forEach(input => {
    input.addEventListener('input', (e) => {
      const key = e.target.dataset[`${prefix}Value`];
      obj[key] = e.target.value;
      updatePreview();
    });
  });

  document.querySelectorAll(`[data-remove-${prefix}]`).forEach(btn => {
    btn.addEventListener('click', (e) => {
      const key = e.target.dataset[`remove${prefix.charAt(0).toUpperCase() + prefix.slice(1)}`];
      delete obj[key];
      renderAllInputs();
      setupDynamicInputListeners();
      updatePreview();
    });
  });
}

/**
 * Save design system
 */
async function saveDesignSystem() {
  const name = $('#save-system-name').value.trim() || $('#system-name').value.trim();
  const description = $('#save-system-description').value.trim() || $('#system-description').value.trim();

  if (!name) {
    showToast('시스템 이름을 입력하세요', 'error');
    return;
  }

  try {
    const data = {
      name,
      description,
      colors: currentSystem.colors,
      typography: currentSystem.typography,
      spacing: currentSystem.spacing,
      borders: currentSystem.borders,
      shadows: currentSystem.shadows,
      css_variables: generateCSSVariables(),
      is_active: saveAsActive
    };

    const method = currentSystem.id ? 'PUT' : 'POST';
    const url = currentSystem.id ? `/api/design-systems/${currentSystem.id}` : '/api/design-systems';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      showToast(`디자인 시스템 "${name}" 저장됨!`, 'success');
      closeSaveModal();
      await loadDesignSystems();
      if (!currentSystem.id) {
        const result = await response.json();
        currentSystem.id = result.systemId;
      }
    }
  } catch (error) {
    console.error('Failed to save design system:', error);
    showToast('Failed to save design system', 'error');
  }
}

/**
 * Export design system
 */
async function exportDesignSystem() {
  if (!currentSystem.id) {
    showToast('먼저 시스템을 저장하세요', 'error');
    return;
  }

  try {
    const response = await fetch(`/api/design-systems/${currentSystem.id}/export`);
    const data = await response.json();

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentSystem.name.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('디자인 시스템이 내보내졌습니다!', 'success');
  } catch (error) {
    console.error('Failed to export:', error);
    showToast('Failed to export design system', 'error');
  }
}

/**
 * Import design system
 */
async function importDesignSystem() {
  const json = $('#import-json').value.trim();

  if (!json) {
    showToast('JSON을 입력하세요', 'error');
    return;
  }

  try {
    const data = JSON.parse(json);

    const response = await fetch('/api/design-systems/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      showToast(`디자인 시스템 "${data.name}" 가져오기 완료!`, 'success');
      closeImportModal();
      await loadDesignSystems();
    }
  } catch (error) {
    console.error('Failed to import:', error);
    showToast('Invalid JSON or import failed', 'error');
  }
}

/**
 * Apply design system to components
 */
async function applyToComponents() {
  if (!currentSystem.id) {
    showToast('먼저 시스템을 저장하세요', 'error');
    return;
  }

  try {
    const response = await fetch(`/api/design-systems/${currentSystem.id}/apply`, {
      method: 'POST'
    });

    if (response.ok) {
      showToast('모든 컴포넌트에 적용되었습니다!', 'success');
    }
  } catch (error) {
    console.error('Failed to apply:', error);
    showToast('Failed to apply design system', 'error');
  }
}

/**
 * Close save modal
 */
function closeSaveModal() {
  $('#save-system-modal').classList.add('hidden');
  $('#save-system-modal').classList.remove('flex');
  $('#save-system-name').value = '';
  $('#save-system-description').value = '';
}

/**
 * Close import modal
 */
function closeImportModal() {
  $('#import-modal').classList.add('hidden');
  $('#import-modal').classList.remove('flex');
  $('#import-json').value = '';
  $('#import-file').value = '';
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

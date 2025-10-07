/**
 * Main Application Script
 * Handles homepage functionality
 */

import { $, $$, createElement, showToast, debounce } from './utils.js';
import { showLoading, hideLoading, showSkeleton } from './loading.js';
import { tryCatch, safeFetch } from './error-boundary.js';

// State
let currentCategory = 'all';
let currentSearch = '';

/**
 * Initialize the application
 */
async function init() {
  console.log('🚀 Initializing Component Library...');

  try {
    // Load categories
    await loadCategories();

    // Load popular components
    await loadPopularComponents();

    // Load all components
    await loadAllComponents();

    // Setup event listeners
    setupEventListeners();

    console.log('✅ Application initialized');
  } catch (error) {
    console.error('❌ Failed to initialize:', error);
    showToast('Failed to load components', 'error');
  }
}

/**
 * Load categories into filters
 */
async function loadCategories() {
  try {
    const response = await fetch('/api/categories');
    const categories = await response.json();

    const container = $('#category-filters');
    if (!container) return;

    // Add "All" button (already in HTML)
    // Add category buttons
    categories.forEach(cat => {
      const button = createElement('button', {
        className: 'filter-btn',
        dataset: { category: cat.name },
        onclick: () => filterByCategory(cat.name)
      }, `${cat.icon} ${cat.display_name}`);

      container.appendChild(button);
    });
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
}

/**
 * Load popular components
 */
async function loadPopularComponents() {
  try {
    const response = await fetch('/api/components?sort=usage&limit=6');
    const data = await response.json();

    renderComponents(data.components, '#popular-components');
  } catch (error) {
    console.error('Failed to load popular components:', error);
  }
}

/**
 * Load all components
 */
async function loadAllComponents(filters = {}) {
  try {
    const queryParams = new URLSearchParams();

    if (currentCategory && currentCategory !== 'all') {
      queryParams.append('category', currentCategory);
    }

    if (currentSearch) {
      queryParams.append('q', currentSearch);
    }

    const response = await fetch(`/api/components?${queryParams}`);
    const data = await response.json();

    renderComponents(data.components, '#all-components');
  } catch (error) {
    console.error('Failed to load components:', error);
  }
}

/**
 * Render components to container
 * @param {Array} components - Components to render
 * @param {string} selector - Container selector
 */
function renderComponents(components, selector) {
  const container = $(selector);
  if (!container) return;

  // Clear loading skeleton
  container.innerHTML = '';

  if (components.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12">
        <p class="text-gray-500 text-lg">No components found</p>
      </div>
    `;
    return;
  }

  components.forEach(component => {
    const card = createComponentCard(component);
    container.appendChild(card);
  });
}

/**
 * Create component card element
 * @param {Object} component - Component data
 * @returns {HTMLElement} Card element
 */
function createComponentCard(component) {
  const card = createElement('div', {
    className: 'component-card',
    onclick: () => navigateToComponent(component.id)
  });

  // Parse props safely
  let props = {};
  try {
    props = JSON.parse(component.props || '{}');
  } catch (e) {
    console.warn('Failed to parse component props:', e);
  }

  card.innerHTML = `
    <div class="mb-4">
      <div class="bg-white/50 rounded-xl p-6 min-h-[120px] flex items-center justify-center">
        <div class="component-preview-mini">
          ${component.html.replace(/\{\{(\w+)\}\}/g, (match, key) => props[key] || match)}
        </div>
      </div>
    </div>
    <div>
      <h3 class="text-xl font-bold mb-2">${component.name}</h3>
      <p class="text-gray-600 text-sm mb-4">${component.description}</p>
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-500">
          ${component.category}
        </span>
        <span class="text-sm text-purple-600 font-semibold">
          📋 ${component.usage_count || 0} copies
        </span>
      </div>
    </div>
  `;

  // Add component-specific styles
  if (component.css) {
    const style = document.createElement('style');
    style.textContent = component.css;
    card.appendChild(style);
  }

  return card;
}

/**
 * Filter components by category
 * @param {string} category - Category name
 */
function filterByCategory(category) {
  currentCategory = category;

  // Update active button
  $$('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });

  // Reload components
  loadAllComponents();
}

/**
 * Search components
 * @param {string} query - Search query
 */
async function searchComponents(query) {
  currentSearch = query;

  if (!query) {
    loadAllComponents();
    return;
  }

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    renderComponents(data.results, '#all-components');

    // Track search
    await fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'search',
        metadata: { query, result_count: data.results.length }
      })
    });
  } catch (error) {
    console.error('Search failed:', error);
  }
}

/**
 * Navigate to component detail page
 * @param {number} componentId - Component ID
 */
function navigateToComponent(componentId) {
  window.location.href = `/pages/component.html?id=${componentId}`;
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Search input
  const searchInput = $('#search-input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      searchComponents(e.target.value);
    }, 300));
  }

  // Category filters
  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterByCategory(btn.dataset.category);
    });
  });

  // Theme toggle
  const themeToggle = $('#theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

/**
 * Toggle dark/light theme
 */
function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  const toggle = $('#theme-toggle');
  if (toggle) {
    toggle.textContent = isDark ? '☀️' : '🌙';
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/**
 * Loading States Management
 * Provides consistent loading indicators across all pages
 */

/**
 * Show loading overlay
 */
export function showLoading(message = 'Loading...') {
  // Remove existing loader
  hideLoading();

  const loader = document.createElement('div');
  loader.id = 'global-loader';
  loader.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]';
  loader.innerHTML = `
    <div class="glass-card p-8 rounded-3xl flex flex-col items-center space-y-4">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
      <p class="text-gray-700 font-medium">${message}</p>
    </div>
  `;

  document.body.appendChild(loader);
}

/**
 * Hide loading overlay
 */
export function hideLoading() {
  const loader = document.getElementById('global-loader');
  if (loader) {
    loader.remove();
  }
}

/**
 * Show loading spinner in specific element
 */
export function showElementLoading(elementId, size = 'md') {
  const element = document.getElementById(elementId);
  if (!element) return;

  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  };

  const spinner = document.createElement('div');
  spinner.className = `loading-spinner animate-spin rounded-full ${sizes[size]} border-purple-200 border-t-purple-600 mx-auto`;
  spinner.dataset.loadingSpinner = 'true';

  element.appendChild(spinner);
}

/**
 * Hide loading spinner in specific element
 */
export function hideElementLoading(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const spinner = element.querySelector('[data-loading-spinner]');
  if (spinner) {
    spinner.remove();
  }
}

/**
 * Show skeleton loading
 */
export function showSkeleton(elementId, count = 3) {
  const element = document.getElementById(elementId);
  if (!element) return;

  element.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'glass-card p-6 rounded-3xl animate-pulse';
    skeleton.innerHTML = `
      <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div class="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div class="h-3 bg-gray-200 rounded w-5/6"></div>
    `;
    element.appendChild(skeleton);
  }
}

/**
 * Show loading button state
 */
export function setButtonLoading(buttonId, loading = true) {
  const button = document.getElementById(buttonId);
  if (!button) return;

  if (loading) {
    button.dataset.originalText = button.textContent;
    button.disabled = true;
    button.innerHTML = `
      <div class="flex items-center justify-center space-x-2">
        <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
        <span>Loading...</span>
      </div>
    `;
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText || 'Submit';
  }
}

/**
 * Show progress bar
 */
export function showProgress(percentage, elementId = 'progress-bar') {
  let progressBar = document.getElementById(elementId);

  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = elementId;
    progressBar.className = 'fixed top-0 left-0 right-0 h-1 bg-gray-200 z-[100]';
    progressBar.innerHTML = '<div class="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"></div>';
    document.body.appendChild(progressBar);
  }

  const bar = progressBar.querySelector('div');
  bar.style.width = `${Math.min(100, Math.max(0, percentage))}%`;

  if (percentage >= 100) {
    setTimeout(() => progressBar.remove(), 300);
  }
}

/**
 * Async operation wrapper with loading state
 */
export async function withLoading(asyncFn, message = 'Loading...') {
  showLoading(message);
  try {
    const result = await asyncFn();
    return result;
  } finally {
    hideLoading();
  }
}

/**
 * Fetch with loading indicator
 */
export async function fetchWithLoading(url, options = {}, message = 'Loading...') {
  showLoading(message);
  try {
    const response = await fetch(url, options);
    return response;
  } finally {
    hideLoading();
  }
}

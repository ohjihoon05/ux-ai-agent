/**
 * Error Boundary System
 * Global error handling and user-friendly error messages
 */

import { showToast } from './utils.js';

/**
 * Initialize error boundary
 */
export function initErrorBoundary() {
  // Global error handler
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    handleError(event.error, 'Unexpected Error');
    event.preventDefault();
  });

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    handleError(event.reason, 'Promise Error');
    event.preventDefault();
  });

  console.log('✅ Error boundary initialized');
}

/**
 * Handle error with user-friendly message
 */
export function handleError(error, context = 'Error') {
  const errorMessage = getErrorMessage(error);
  const userMessage = getUserFriendlyMessage(errorMessage, context);

  // Show toast notification
  showToast(userMessage, 'error');

  // Log to analytics (if available)
  if (typeof window.trackError === 'function') {
    window.trackError(context, errorMessage);
  }
}

/**
 * Get error message from various error types
 */
function getErrorMessage(error) {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return 'Unknown error occurred';
}

/**
 * Convert technical error to user-friendly message
 */
function getUserFriendlyMessage(errorMessage, context) {
  const errorMap = {
    'Failed to fetch': '네트워크 연결을 확인해주세요',
    'NetworkError': '네트워크 오류가 발생했습니다',
    'Not Found': '요청한 리소스를 찾을 수 없습니다',
    'Unauthorized': '권한이 없습니다',
    'Forbidden': '접근이 거부되었습니다',
    'Internal Server Error': '서버 오류가 발생했습니다',
    'Timeout': '요청 시간이 초과되었습니다',
    'Database': '데이터베이스 오류가 발생했습니다',
    'Validation': '입력값을 확인해주세요'
  };

  for (const [key, message] of Object.entries(errorMap)) {
    if (errorMessage.includes(key)) {
      return message;
    }
  }

  return `오류가 발생했습니다: ${context}`;
}

/**
 * Try-catch wrapper with error handling
 */
export async function tryCatch(fn, context = 'Operation') {
  try {
    return await fn();
  } catch (error) {
    handleError(error, context);
    return null;
  }
}

/**
 * Fetch with error handling
 */
export async function safeFetch(url, options = {}, context = 'Data loading') {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    handleError(error, context);
    throw error;
  }
}

/**
 * Show error page
 */
export function showErrorPage(error, context = 'Error') {
  const container = document.getElementById('main-content') || document.body;

  container.innerHTML = `
    <div class="min-h-screen flex items-center justify-center px-6">
      <div class="glass-card p-12 rounded-3xl text-center max-w-2xl">
        <div class="text-6xl mb-6">⚠️</div>
        <h1 class="text-3xl font-bold mb-4 text-gray-800">${context}</h1>
        <p class="text-gray-600 mb-8">${getUserFriendlyMessage(getErrorMessage(error), context)}</p>
        <div class="space-x-4">
          <button onclick="location.reload()" class="btn-gradient px-8 py-3 rounded-xl font-semibold text-white hover:shadow-lg transition-all">
            🔄 새로고침
          </button>
          <button onclick="window.location.href='/'" class="px-8 py-3 rounded-xl border-2 border-gray-300 font-semibold hover:border-purple-500 transition-all">
            🏠 홈으로
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Retry failed operation
 */
export async function retry(fn, maxAttempts = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }

      console.log(`Retry attempt ${attempt}/${maxAttempts}...`);
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
}

/**
 * Validate response
 */
export function validateResponse(response, context = 'Response') {
  if (!response) {
    throw new Error(`${context}: No response received`);
  }

  if (!response.ok) {
    throw new Error(`${context}: ${response.status} ${response.statusText}`);
  }

  return response;
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initErrorBoundary);
} else {
  initErrorBoundary();
}

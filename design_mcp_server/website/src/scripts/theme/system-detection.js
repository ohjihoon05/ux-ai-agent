/**
 * SystemThemeDetector Module
 *
 * Detects and monitors system theme preference using prefers-color-scheme media query.
 * Provides fallback for browsers that don't support matchMedia.
 *
 * @module SystemThemeDetector
 */

/**
 * SystemThemeDetector API
 */
export const SystemThemeDetector = {
  /**
   * Media query for dark mode detection
   * @private
   */
  _query: null,

  /**
   * Initialize media query (lazy initialization)
   * @private
   */
  _initQuery() {
    if (this._query) return;

    // Fallback for browsers without matchMedia
    if (!window.matchMedia) {
      console.warn('matchMedia not supported, defaulting to light theme');
      this._query = {
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {},
      };
      return;
    }

    this._query = window.matchMedia('(prefers-color-scheme: dark)');
  },

  /**
   * Detect current system theme
   *
   * @returns {('light'|'dark')} Detected theme
   */
  detect() {
    this._initQuery();
    return this._query.matches ? 'dark' : 'light';
  },

  /**
   * Register listener for system theme changes
   *
   * @param {Function} callback - Called with new theme when system preference changes
   * @returns {Function} Cleanup function to remove listener
   *
   * @example
   * const unsubscribe = SystemThemeDetector.onChange((theme) => {
   *   console.log('System theme changed to:', theme);
   * });
   * // Later: unsubscribe();
   */
  onChange(callback) {
    this._initQuery();

    const handler = (event) => {
      const theme = event.matches ? 'dark' : 'light';
      callback(theme);
    };

    // Use modern addEventListener (addListener is deprecated)
    if (this._query.addEventListener) {
      this._query.addEventListener('change', handler);
    } else if (this._query.addListener) {
      // Fallback for older browsers
      this._query.addListener(handler);
    }

    // Return cleanup function
    return () => {
      if (this._query.removeEventListener) {
        this._query.removeEventListener('change', handler);
      } else if (this._query.removeListener) {
        this._query.removeListener(handler);
      }
    };
  }
};

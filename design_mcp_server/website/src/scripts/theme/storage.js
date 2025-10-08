/**
 * ThemeStorage Module
 *
 * Handles localStorage operations for theme preferences.
 * Implements error handling for quota exceeded, security errors, and corrupt data.
 *
 * @module ThemeStorage
 */

const STORAGE_KEY = 'theme-preference';

/**
 * ThemeStorage API
 */
export const ThemeStorage = {
  /**
   * Save theme preference to localStorage
   *
   * @param {Object} preference - Theme preference object
   * @param {('light'|'dark')} preference.theme - Selected theme
   * @param {('manual'|'system')} preference.source - Selection source
   * @param {number} preference.timestamp - Last change timestamp
   */
  save(preference) {
    try {
      const data = JSON.stringify(preference);
      localStorage.setItem(STORAGE_KEY, data);
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded, theme preference not saved');
        // Continue with in-memory state
      } else if (error.name === 'SecurityError') {
        console.warn('localStorage access denied (private browsing?), theme preference not saved');
        // Continue with in-memory state
      } else {
        console.error('Unexpected error saving theme preference:', error);
      }
    }
  },

  /**
   * Load theme preference from localStorage
   *
   * @returns {Object|null} Theme preference or null if not found/invalid
   */
  load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;

      const parsed = JSON.parse(data);

      // Validate structure
      if (!this._validate(parsed)) {
        console.warn('Invalid theme preference structure, clearing');
        this.clear();
        return null;
      }

      return parsed;
    } catch (error) {
      console.warn('Failed to load theme preference, clearing:', error.message);
      this.clear();
      return null;
    }
  },

  /**
   * Clear theme preference from localStorage
   */
  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear theme preference:', error);
    }
  },

  /**
   * Validate theme preference structure
   *
   * @private
   * @param {*} data - Data to validate
   * @returns {boolean} True if valid
   */
  _validate(data) {
    if (!data || typeof data !== 'object') return false;

    const { theme, source, timestamp } = data;

    // Validate theme
    if (theme !== 'light' && theme !== 'dark') return false;

    // Validate source
    if (source !== 'manual' && source !== 'system') return false;

    // Validate timestamp
    if (typeof timestamp !== 'number' || timestamp <= 0) return false;

    return true;
  }
};

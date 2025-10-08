/**
 * ThemeManager Module
 *
 * Central theme management system.
 * Handles theme switching, persistence, system detection, and event notifications.
 *
 * @module ThemeManager
 */

import { ThemeStorage } from './storage.js';
import { SystemThemeDetector } from './system-detection.js';

/**
 * Runtime state
 * @private
 */
const state = {
  currentTheme: 'light',
  isTransitioning: false,
  systemTheme: 'light',
  listeners: [],
};

/**
 * ThemeManager API
 */
export const ThemeManager = {
  /**
   * Get current active theme
   *
   * @returns {('light'|'dark')} Current theme
   */
  getCurrentTheme() {
    return state.currentTheme;
  },

  /**
   * Set theme (manual selection)
   *
   * @param {('light'|'dark')} theme - Theme to set
   * @throws {Error} If invalid theme value
   */
  setTheme(theme) {
    // Validate theme
    if (theme !== 'light' && theme !== 'dark') {
      throw new Error(`Invalid theme: ${theme}. Must be 'light' or 'dark'.`);
    }

    // Prevent race conditions
    if (state.isTransitioning) {
      console.warn('Theme transition already in progress, ignoring');
      return;
    }

    state.isTransitioning = true;

    try {
      // Update DOM
      document.documentElement.setAttribute('data-theme', theme);

      // Update state
      const previousTheme = state.currentTheme;
      state.currentTheme = theme;

      // Save to storage (manual source)
      const preference = {
        theme,
        source: 'manual',
        timestamp: Date.now(),
      };
      ThemeStorage.save(preference);

      // Notify listeners
      this._notifyListeners(theme);

      // Dispatch custom event
      this._dispatchEvent(theme, previousTheme, 'manual');
    } finally {
      // Allow next transition after animation completes
      setTimeout(() => {
        state.isTransitioning = false;
      }, 300); // Match CSS transition duration
    }
  },

  /**
   * Toggle between light and dark themes
   *
   * @returns {('light'|'dark')} New theme after toggle
   */
  toggleTheme() {
    const newTheme = state.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    return newTheme;
  },

  /**
   * Detect system theme preference
   *
   * @returns {('light'|'dark')} Detected system theme
   */
  detectSystemTheme() {
    return SystemThemeDetector.detect();
  },

  /**
   * Register theme change listener
   *
   * @param {Function} callback - Called with new theme on change
   * @returns {Function} Cleanup function to remove listener
   *
   * @example
   * const unsubscribe = ThemeManager.onThemeChange((theme) => {
   *   console.log('Theme changed to:', theme);
   * });
   * // Later: unsubscribe();
   */
  onThemeChange(callback) {
    state.listeners.push(callback);

    // Return cleanup function
    return () => {
      const index = state.listeners.indexOf(callback);
      if (index > -1) {
        state.listeners.splice(index, 1);
      }
    };
  },

  /**
   * Initialize theme system
   *
   * - Loads saved theme from storage
   * - Falls back to system theme if no saved preference
   * - Applies theme to DOM
   * - Registers system theme change listener
   *
   * @returns {('light'|'dark')} Initial theme
   */
  initialize() {
    // Detect system theme
    state.systemTheme = this.detectSystemTheme();

    // Try to load saved preference
    const saved = ThemeStorage.load();

    let initialTheme;
    let source;

    if (saved && saved.source === 'manual') {
      // Manual selection takes priority
      initialTheme = saved.theme;
      source = 'manual';
    } else {
      // Use system preference
      initialTheme = state.systemTheme;
      source = 'system';
    }

    // Apply theme to DOM
    document.documentElement.setAttribute('data-theme', initialTheme);
    state.currentTheme = initialTheme;

    // Listen for system theme changes
    SystemThemeDetector.onChange((newSystemTheme) => {
      state.systemTheme = newSystemTheme;

      // Only apply if user hasn't manually selected a theme
      const currentSaved = ThemeStorage.load();
      if (!currentSaved || currentSaved.source === 'system') {
        this._applySystemTheme(newSystemTheme);
      }
    });

    return initialTheme;
  },

  /**
   * Reset to system default theme
   *
   * Clears manual selection and uses system preference
   *
   * @returns {('light'|'dark')} Theme after reset
   */
  reset() {
    // Clear storage
    ThemeStorage.clear();

    // Apply system theme
    const systemTheme = this.detectSystemTheme();
    this._applySystemTheme(systemTheme);

    return systemTheme;
  },

  /**
   * Apply system theme (internal use)
   *
   * @private
   * @param {('light'|'dark')} theme - System theme to apply
   */
  _applySystemTheme(theme) {
    // Update DOM
    document.documentElement.setAttribute('data-theme', theme);

    // Update state
    const previousTheme = state.currentTheme;
    state.currentTheme = theme;

    // Save to storage (system source)
    const preference = {
      theme,
      source: 'system',
      timestamp: Date.now(),
    };
    ThemeStorage.save(preference);

    // Notify listeners
    this._notifyListeners(theme);

    // Dispatch custom event
    this._dispatchEvent(theme, previousTheme, 'system');
  },

  /**
   * Notify all registered listeners
   *
   * @private
   * @param {('light'|'dark')} theme - New theme
   */
  _notifyListeners(theme) {
    state.listeners.forEach(callback => {
      try {
        callback(theme);
      } catch (error) {
        console.error('Error in theme change listener:', error);
      }
    });
  },

  /**
   * Dispatch custom DOM event
   *
   * @private
   * @param {('light'|'dark')} theme - New theme
   * @param {('light'|'dark')} previousTheme - Previous theme
   * @param {('manual'|'system'|'sync')} source - Change source
   */
  _dispatchEvent(theme, previousTheme, source) {
    const event = new CustomEvent('theme:changed', {
      detail: { theme, previousTheme, source },
    });
    document.dispatchEvent(event);
  },
};

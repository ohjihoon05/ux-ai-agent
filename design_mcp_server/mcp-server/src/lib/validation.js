/**
 * Input Validation Utility
 *
 * Validates and sanitizes tool inputs
 */

/**
 * Validate required fields
 */
export function validateRequired(args, fields) {
  const missing = [];

  for (const field of fields) {
    if (args[field] === undefined || args[field] === null || args[field] === '') {
      missing.push(field);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}

/**
 * Validate string field
 */
export function validateString(value, fieldName, options = {}) {
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }

  if (options.minLength && value.length < options.minLength) {
    throw new Error(`${fieldName} must be at least ${options.minLength} characters`);
  }

  if (options.maxLength && value.length > options.maxLength) {
    throw new Error(`${fieldName} must be at most ${options.maxLength} characters`);
  }

  if (options.pattern && !options.pattern.test(value)) {
    throw new Error(`${fieldName} has invalid format`);
  }

  return value.trim();
}

/**
 * Validate number field
 */
export function validateNumber(value, fieldName, options = {}) {
  const num = Number(value);

  if (isNaN(num)) {
    throw new Error(`${fieldName} must be a number`);
  }

  if (options.min !== undefined && num < options.min) {
    throw new Error(`${fieldName} must be at least ${options.min}`);
  }

  if (options.max !== undefined && num > options.max) {
    throw new Error(`${fieldName} must be at most ${options.max}`);
  }

  if (options.integer && !Number.isInteger(num)) {
    throw new Error(`${fieldName} must be an integer`);
  }

  return num;
}

/**
 * Validate enum field
 */
export function validateEnum(value, fieldName, allowedValues) {
  if (!allowedValues.includes(value)) {
    throw new Error(
      `${fieldName} must be one of: ${allowedValues.join(', ')}`
    );
  }

  return value;
}

/**
 * Validate object field
 */
export function validateObject(value, fieldName) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${fieldName} must be an object`);
  }

  return value;
}

/**
 * Validate array field
 */
export function validateArray(value, fieldName, options = {}) {
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }

  if (options.minLength && value.length < options.minLength) {
    throw new Error(`${fieldName} must have at least ${options.minLength} items`);
  }

  if (options.maxLength && value.length > options.maxLength) {
    throw new Error(`${fieldName} must have at most ${options.maxLength} items`);
  }

  return value;
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHtml(html) {
  // Basic sanitization - remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '');
}

/**
 * Validate component name
 */
export function validateComponentName(name) {
  return validateString(name, 'Component name', {
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z][a-zA-Z0-9-_]*$/,
  });
}

/**
 * Validate category
 */
export function validateCategory(category) {
  const validCategories = [
    'buttons',
    'cards',
    'forms',
    'navigation',
    'modals',
    'tables',
    'layouts',
    'feedback',
  ];

  return validateEnum(category, 'Category', validCategories);
}

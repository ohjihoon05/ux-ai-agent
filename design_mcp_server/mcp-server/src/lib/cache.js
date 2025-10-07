/**
 * Simple In-Memory Cache
 *
 * Caches component queries for better performance
 */

const cache = new Map();
const TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Cache entry structure
 */
class CacheEntry {
  constructor(value) {
    this.value = value;
    this.timestamp = Date.now();
  }

  isExpired() {
    return Date.now() - this.timestamp > TTL;
  }
}

/**
 * Get value from cache
 */
export function get(key) {
  const entry = cache.get(key);

  if (!entry) {
    return null;
  }

  if (entry.isExpired()) {
    cache.delete(key);
    return null;
  }

  return entry.value;
}

/**
 * Set value in cache
 */
export function set(key, value) {
  cache.set(key, new CacheEntry(value));
}

/**
 * Delete value from cache
 */
export function del(key) {
  cache.delete(key);
}

/**
 * Clear all cache
 */
export function clear() {
  cache.clear();
}

/**
 * Get cache stats
 */
export function stats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}

/**
 * Cached query wrapper
 */
export function cached(key, ttl = TTL) {
  return function (target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args) {
      const cacheKey = `${key}:${JSON.stringify(args)}`;
      const cached = get(cacheKey);

      if (cached !== null) {
        return cached;
      }

      const result = await originalMethod.apply(this, args);
      set(cacheKey, result);

      return result;
    };

    return descriptor;
  };
}

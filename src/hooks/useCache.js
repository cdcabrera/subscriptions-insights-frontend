import { useCallback, useState } from 'react';
import { useEvent } from 'react-use';
import LruCache from 'lru-cache';

/**
 * Selector cache.
 *
 * @private
 * @type {object}
 */
const lruCache = new LruCache({
  maxAge: Number.parseInt(process.env.REACT_APP_HOOK_CACHE, 10),
  max: 10,
  stale: true,
  updateAgeOnGet: true
});

/**
 * Basic memory cache.
 *
 * @param {string} key
 * @returns {Array}
 */
const useMemoryCache = key => {
  const [cache, setCache] = useState(lruCache.get(key) || undefined);

  const updateCache = useCallback(
    value => {
      lruCache.set(key, value);
      setCache(value);
    },
    [key]
  );

  return [cache, updateCache];
};

/**
 * Use session storage, allow multi-window/tab updates.
 *
 * @param {string} key
 * @returns {Array}
 */
const useSessionCache = key => {
  const [cache, setCache] = useState(window.sessionStorage.getItem(key));

  useEvent(window, 'storage', () => {
    setCache(window.sessionStorage.getItem(key));
  });

  const updateCache = useCallback(
    value => {
      window.sessionStorage.setItem(key, value);
      setCache(value);
    },
    [key]
  );

  return [cache, updateCache];
};

const cacheHooks = {
  useMemoryCache,
  useSessionCache
};

export { cacheHooks as default, cacheHooks, useMemoryCache, useSessionCache };

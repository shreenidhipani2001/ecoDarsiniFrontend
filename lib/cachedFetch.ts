/**
 * Stale-While-Revalidate caching layer for API calls.
 *
 * How it works:
 * 1. First call → fetches from API, caches in localStorage, returns data.
 * 2. Subsequent calls within TTL → returns cached data instantly (no network).
 * 3. Calls after TTL expires → returns stale cache immediately, then
 *    revalidates in the background and updates the cache.
 * 4. If no cache exists → fetches from API normally.
 *
 * This makes navigating between pages feel instant for categories,
 * subcategories, blogs, and recently-viewed product lists.
 */

const CACHE_PREFIX = 'swr_cache_';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  etag?: string;
}

interface CachedFetchOptions {
  /** Time-to-live in milliseconds before data is considered stale */
  ttl: number;
  /** Maximum age in ms before stale data is discarded entirely (default: 4x ttl) */
  maxStale?: number;
}

// In-memory map to prevent duplicate in-flight requests for the same key
const inflightRequests = new Map<string, Promise<unknown>>();

// In-memory cache for the current session (faster than localStorage)
const memoryCache = new Map<string, CacheEntry<unknown>>();

function getCacheKey(url: string): string {
  return CACHE_PREFIX + url;
}

function getFromCache<T>(key: string): CacheEntry<T> | null {
  // Try memory first (faster)
  const memEntry = memoryCache.get(key) as CacheEntry<T> | undefined;
  if (memEntry) return memEntry;

  // Fall back to localStorage
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry<T>;
    // Also populate memory cache
    memoryCache.set(key, entry as CacheEntry<unknown>);
    return entry;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T): void {
  const entry: CacheEntry<T> = { data, timestamp: Date.now() };
  memoryCache.set(key, entry as CacheEntry<unknown>);
  try {
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // localStorage full — clear old SWR entries and retry
    clearOldEntries();
    try {
      localStorage.setItem(key, JSON.stringify(entry));
    } catch {
      // Still full — just use memory cache
    }
  }
}

function clearOldEntries(): void {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith(CACHE_PREFIX)) keys.push(k);
  }
  // Remove oldest half
  const entries = keys
    .map((k) => {
      try {
        const raw = localStorage.getItem(k);
        const parsed = raw ? JSON.parse(raw) : null;
        return { key: k, ts: parsed?.timestamp ?? 0 };
      } catch {
        return { key: k, ts: 0 };
      }
    })
    .sort((a, b) => a.ts - b.ts);

  const removeCount = Math.ceil(entries.length / 2);
  for (let i = 0; i < removeCount; i++) {
    localStorage.removeItem(entries[i].key);
    memoryCache.delete(entries[i].key);
  }
}

/**
 * Fetch with stale-while-revalidate caching.
 *
 * @param url      Full URL to fetch
 * @param options  Caching options (ttl, maxStale)
 * @param fetchOpts  Standard RequestInit options for the fetch call
 * @returns        The parsed JSON response
 */
export async function cachedFetch<T>(
  url: string,
  { ttl, maxStale }: CachedFetchOptions,
  fetchOpts: RequestInit = {}
): Promise<T> {
  const key = getCacheKey(url);
  const cached = getFromCache<T>(key);
  const now = Date.now();
  const effectiveMaxStale = maxStale ?? ttl * 4;

  // FRESH CACHE — return immediately, no network
  if (cached && now - cached.timestamp < ttl) {
    return cached.data;
  }

  // STALE CACHE — return immediately, revalidate in background
  if (cached && now - cached.timestamp < effectiveMaxStale) {
    // Background revalidation (deduped)
    if (!inflightRequests.has(key)) {
      const revalidate = fetch(url, { ...fetchOpts, cache: undefined })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((freshData) => {
          setCache(key, freshData);
        })
        .catch(() => {
          // Revalidation failed — keep stale data
        })
        .finally(() => {
          inflightRequests.delete(key);
        });
      inflightRequests.set(key, revalidate);
    }
    return cached.data;
  }

  // NO CACHE or EXPIRED — must fetch (deduped)
  if (inflightRequests.has(key)) {
    return inflightRequests.get(key) as Promise<T>;
  }

  const request = fetch(url, { ...fetchOpts, cache: undefined })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data: T) => {
      setCache(key, data);
      return data;
    })
    .finally(() => {
      inflightRequests.delete(key);
    });

  inflightRequests.set(key, request);
  return request;
}

/**
 * Invalidate a specific cache entry (e.g., after a mutation).
 */
export function invalidateCache(url: string): void {
  const key = getCacheKey(url);
  memoryCache.delete(key);
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/**
 * Invalidate all cache entries matching a prefix.
 * Example: invalidateCacheByPrefix('/api/products') clears all product caches.
 */
export function invalidateCacheByPrefix(urlPrefix: string): void {
  const fullPrefix = CACHE_PREFIX + urlPrefix;

  // Memory cache
  for (const key of memoryCache.keys()) {
    if (key.startsWith(fullPrefix)) memoryCache.delete(key);
  }

  // localStorage
  const toRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith(fullPrefix)) toRemove.push(k);
  }
  toRemove.forEach((k) => {
    try { localStorage.removeItem(k); } catch { /* ignore */ }
  });
}

// ─── Pre-configured helpers for common data types ────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** Categories — changes very rarely, cache for 30 minutes */
export function fetchCategoriesCached(): Promise<unknown> {
  return cachedFetch(`${API_URL}/api/categories/`, { ttl: 30 * 60 * 1000 });
}

/** Subcategories — changes very rarely, cache for 30 minutes */
export function fetchSubcategoriesCached(): Promise<unknown> {
  return cachedFetch(`${API_URL}/api/subcategories`, { ttl: 30 * 60 * 1000 });
}

/** Products list — cache for 3 minutes per unique query */
export function fetchProductsCached(queryString: string): Promise<unknown> {
  return cachedFetch(
    `${API_URL}/api/products?${queryString}`,
    { ttl: 3 * 60 * 1000 }
  );
}

/** Single product — cache for 10 minutes */
export function fetchProductByIdCached(id: string): Promise<unknown> {
  return cachedFetch(
    `${API_URL}/api/products/${id}`,
    { ttl: 10 * 60 * 1000 }
  );
}

/** Blogs list — cache for 10 minutes */
export function fetchBlogsCached(): Promise<unknown> {
  return cachedFetch(`${API_URL}/api/blogs`, { ttl: 10 * 60 * 1000 });
}

/** Single blog — cache for 10 minutes */
export function fetchBlogByIdCached(id: string): Promise<unknown> {
  return cachedFetch(
    `${API_URL}/api/blogs/${id}`,
    { ttl: 10 * 60 * 1000 }
  );
}

/** Latest 5 products — cache for 5 minutes */
export function fetchLatestProductsCached(): Promise<unknown> {
  return cachedFetch(
    `${API_URL}/api/products/five-latest`,
    { ttl: 5 * 60 * 1000 }
  );
}

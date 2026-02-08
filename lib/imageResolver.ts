/**
 * Frontend Image Resolver
 *
 * Resolves Payload CMS image IDs directly from the frontend,
 * bypassing the ecommerce backend for image data.
 *
 * Flow:  Frontend → Payload CMS (direct) → Cloudinary URLs
 * Cache: memory + localStorage (images rarely change)
 */

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL;

export type ResolvedImage = {
  id: string;
  url: string;
  thumbnail: string;
  card: string;
  full: string;
  alt?: string;
};

// ── Cache layer ──────────────────────────────────────────────────────────

const CACHE_PREFIX = 'cms_img_';
const memoryCache = new Map<string, ResolvedImage>();

function buildUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${CMS_URL}${path}`;
}

// ── Single image resolver ────────────────────────────────────────────────

export async function resolveImageById(imageId: string): Promise<ResolvedImage | null> {
  if (!imageId || !CMS_URL) return null;

  // 1. Memory cache (instant)
  const mem = memoryCache.get(imageId);
  if (mem) return mem;

  // 2. localStorage cache (fast)
  try {
    const stored = localStorage.getItem(`${CACHE_PREFIX}${imageId}`);
    if (stored) {
      const parsed = JSON.parse(stored) as ResolvedImage;
      memoryCache.set(imageId, parsed);
      return parsed;
    }
  } catch {
    // localStorage unavailable
  }

  // 3. Fetch from Payload CMS directly
  try {
    const res = await fetch(`${CMS_URL}/api/media/${imageId}?depth=0`);
    if (!res.ok) return null;

    const data = await res.json();
    const resolved: ResolvedImage = {
      id: data.id || imageId,
      url: buildUrl(data.url),
      thumbnail: buildUrl(data.sizes?.thumbnail?.url) || buildUrl(data.url),
      card: buildUrl(data.sizes?.card?.url) || buildUrl(data.url),
      full: buildUrl(data.sizes?.full?.url) || buildUrl(data.url),
      alt: data.alt || '',
    };

    // Cache in both layers
    memoryCache.set(imageId, resolved);
    try {
      localStorage.setItem(`${CACHE_PREFIX}${imageId}`, JSON.stringify(resolved));
    } catch {
      // localStorage full — ignore
    }

    return resolved;
  } catch {
    return null;
  }
}

// ── Bulk image resolver ──────────────────────────────────────────────────

export async function resolveImages(imageIds: string[]): Promise<ResolvedImage[]> {
  if (!imageIds?.length) return [];
  const results = await Promise.all(imageIds.map((id) => resolveImageById(id)));
  return results.filter(Boolean) as ResolvedImage[];
}

// ── Product image attachment (frontend-side) ─────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProductLike = Record<string, any> & {
  images?: ResolvedImage[];
  cms_image_ids?: string[];
};

/**
 * Attach images to a single product.
 * If `product.images` already exists (backend attached them), use as-is.
 * Otherwise resolve from `cms_image_ids` via Payload CMS.
 */
export async function attachImagesToProductFrontend<T extends ProductLike>(
  product: T
): Promise<T & { images: ResolvedImage[] }> {
  if (product.images && product.images.length > 0) {
    return product as T & { images: ResolvedImage[] };
  }

  const images = product.cms_image_ids
    ? await resolveImages(product.cms_image_ids)
    : [];

  return { ...product, images };
}

/**
 * Attach images to multiple products.
 * Pre-fetches all unique image IDs in parallel, then uses cache.
 */
export async function attachImagesToProductsFrontend<T extends ProductLike>(
  products: T[]
): Promise<(T & { images: ResolvedImage[] })[]> {
  if (!products?.length) return [];

  // Collect all unique image IDs that need resolving
  const idsToResolve = new Set<string>();
  for (const p of products) {
    if ((!p.images || p.images.length === 0) && p.cms_image_ids) {
      for (const id of p.cms_image_ids) {
        idsToResolve.add(id);
      }
    }
  }

  // Pre-fetch all unique images in parallel (populates cache)
  if (idsToResolve.size > 0) {
    await Promise.all([...idsToResolve].map((id) => resolveImageById(id)));
  }

  // Attach to each product (uses cache — instant)
  return Promise.all(products.map((p) => attachImagesToProductFrontend(p)));
}

// ── Quick helper for components ──────────────────────────────────────────

/**
 * Get the best image URL for a product (for use in img src).
 * Falls back through: card → url → thumbnail → empty string.
 */
export function getProductImage(
  product: ProductLike,
  size: 'thumbnail' | 'card' | 'full' | 'url' = 'card'
): string {
  if (!product.images || product.images.length === 0) return '';
  const img = product.images[0];
  return img[size] || img.card || img.url || '';
}

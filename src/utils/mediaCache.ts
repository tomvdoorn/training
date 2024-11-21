const URL_CACHE = new Map<string, { url: string; expires: number }>();
const CACHE_BUFFER = 300; // 5 minutes buffer

export function getCachedUrl(path: string): string | null {
  const cached = URL_CACHE.get(path);
  if (cached && cached.expires > Date.now() + CACHE_BUFFER * 1000) {
    return cached.url;
  }
  return null;
}

export function setCachedUrl(path: string, url: string, expiresIn: number): void {
  URL_CACHE.set(path, {
    url,
    expires: Date.now() + (expiresIn * 1000)
  });
} 
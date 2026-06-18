const store = new Map<string, { data: any; expiresAt: number }>();

export function getCached<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCache(key: string, data: any, ttlMs: number = 300000): void {
  store.set(key, { data, expiresAt: Date.now() + ttlMs });
}

export function clearCache(key: string): void {
  store.delete(key);
}

export function clearCacheByPrefix(prefix: string): void {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}

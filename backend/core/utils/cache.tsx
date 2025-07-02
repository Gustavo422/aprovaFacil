interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheOptions {
  ttl?: number; // Default TTL in milliseconds (5 minutes)
  maxSize?: number; // Maximum number of entries
}

class Cache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private readonly defaultTtl: number;
  private readonly maxSize: number;

  constructor(options: CacheOptions = {}) {
    this.defaultTtl = options.ttl || 5 * 60 * 1000; // 5 minutes
    this.maxSize = options.maxSize || 1000;
  }

  /**
   * Armazena um valor no cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    // Limpar cache se estiver cheio
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTtl,
    };

    this.cache.set(key, entry);
  }

  /**
   * Recupera um valor do cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    // Verificar se expirou
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Remove um item do cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Limpa todo o cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Remove itens expirados
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Remove o item mais antigo do cache
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Retorna estatísticas do cache
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      defaultTtl: this.defaultTtl,
    };
  }
}

// Instâncias de cache para diferentes domínios
export const simuladosCache = new Cache({ ttl: 10 * 60 * 1000 }); // 10 minutos
export const flashcardsCache = new Cache({ ttl: 15 * 60 * 1000 }); // 15 minutos
export const apostilasCache = new Cache({ ttl: 30 * 60 * 1000 }); // 30 minutos
export const userProgressCache = new Cache({ ttl: 5 * 60 * 1000 }); // 5 minutos

// Helper para gerar chaves de cache
export function createCacheKey(prefix: string, ...params: unknown[]): string {
  return `${prefix}:${params.join(':')}`;
}

// Helper para cache com fallback
export async function withCache<T>(
  cache: Cache,
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Tentar buscar do cache
  const cached = cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Buscar dados
  const data = await fetcher();
  
  // Armazenar no cache
  cache.set(key, data, ttl);
  
  return data;
}

// Limpeza automática do cache a cada 5 minutos
setInterval(() => {
  simuladosCache.cleanup();
  flashcardsCache.cleanup();
  apostilasCache.cleanup();
  userProgressCache.cleanup();
}, 5 * 60 * 1000); 
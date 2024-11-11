class IPInfoCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 2 * 60 * 60 * 1000;
  }

  getCachedIP(proxy) {
    const cached = this.cache.get(proxy);
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.info;
    }
    this.cache.delete(proxy);
    return null;
  }

  cacheIP(proxy, info) {
    this.cache.set(proxy, { info, timestamp: Date.now() });
  }
}

module.exports = IPInfoCache;

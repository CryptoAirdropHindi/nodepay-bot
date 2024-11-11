const axios = require('axios');
const IPInfoCache = require('./ipInfoCache');

class ProxyChecker {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.ipCache = new IPInfoCache();
  }

  async getProxyIP(proxy) {
    const cachedIP = this.ipCache.getCachedIP(proxy);
    if (cachedIP) return cachedIP;

    try {
      const response = await axios.get(this.config.ipCheckURL, {
        proxy: this.buildProxyConfig(proxy),
      });
      const ipInfo = response.data;
      this.ipCache.cacheIP(proxy, ipInfo);
      return ipInfo;
    } catch (error) {
      throw new Error('Proxy IP check failed');
    }
  }

  buildProxyConfig(proxy) {
    return proxy && proxy.host
      ? {
          host: proxy.host,
          port: parseInt(proxy.port),
          auth:
            proxy.username && proxy.password
              ? { username: proxy.username, password: proxy.password }
              : undefined,
        }
      : undefined;
  }
}

module.exports = ProxyChecker;

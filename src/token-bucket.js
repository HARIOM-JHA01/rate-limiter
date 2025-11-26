// Simple token bucket implementation (per-key instances)
export default function createInMemoryTokenBucket({ capacity = 60, refillRate = 1 } = {}) {
  class Bucket {
    constructor() {
      this.capacity = capacity;
      this.tokens = capacity;
      this.refillRate = refillRate;
      this.lastRefill = Date.now();
    }

    _refill() {
      const now = Date.now();
      const delta = (now - this.lastRefill) / 1000;
      if (delta <= 0) return;
      this.tokens = Math.min(this.capacity, this.tokens + delta * this.refillRate);
      this.lastRefill = now;
    }

    tryRemoveToken(count = 1) {
      this._refill();
      if (this.tokens >= count) {
        this.tokens -= count;
        return true;
      }
      return false;
    }

    getState() {
      this._refill();
      return { tokens: this.tokens, capacity: this.capacity };
    }
  }

  const store = new Map();

  function getBucket(key) {
    if (!store.has(key)) store.set(key, new Bucket());
    return store.get(key);
  }

  return { getBucket };
}

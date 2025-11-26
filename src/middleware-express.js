import createInMemoryTokenBucket from './token-bucket.js';
import createRedisSlidingWindow from './redis-sliding-window.js';

export function expressMiddleware({
  type = 'in-memory',
  inMemory = { capacity: 60, refillRate: 1 },
  redisClient,
  windowMs = 60_000,
  limit = 60,
  keyExtractor = (req) => req.ip,
  onLimit = (req, res) => res.status(429).json({ message: 'Too many requests' }),
  logger = console,
} = {}) {
  const inMemoryImpl = createInMemoryTokenBucket(inMemory);
  const redisImpl = type === 'redis' ? createRedisSlidingWindow({ redisClient }) : null;

  return async function (req, res, next) {
    try {
      const key = keyExtractor(req);

      if (type === 'in-memory') {
        const bucket = inMemoryImpl.getBucket(key);
        if (bucket.tryRemoveToken()) return next();
        return onLimit(req, res);
      }

      if (type === 'redis') {
        const { checkAndAdd } = redisImpl;
        const result = await checkAndAdd(`rate:${key}`, windowMs, limit);
        if (result.allowed) return next();
        return onLimit(req, res);
      }

      next();
    } catch (err) {
      logger.error('Rate limiter error', err);
      next(); // fail open
    }
  };
}

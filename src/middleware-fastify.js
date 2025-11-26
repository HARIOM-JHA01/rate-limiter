import fp from 'fastify-plugin';
import createInMemoryTokenBucket from './token-bucket.js';
import createRedisSlidingWindow from './redis-sliding-window.js';

export const fastifyPlugin = fp(async function (fastify, opts) {
  const {
    type = 'in-memory',
    inMemory = { capacity: 60, refillRate: 1 },
    redisClient,
    windowMs = 60_000,
    limit = 60,
    keyExtractor = (request) => request.ip,
    onLimit = (request, reply) => reply.code(429).send({ message: 'Too many requests' }),
  } = opts;

  const inMemoryImpl = createInMemoryTokenBucket(inMemory);
  const redisImpl = type === 'redis' ? createRedisSlidingWindow({ redisClient }) : null;

  fastify.addHook('onRequest', async (request, reply) => {
    const key = keyExtractor(request);

    if (type === 'in-memory') {
      const bucket = inMemoryImpl.getBucket(key);
      if (!bucket.tryRemoveToken()) return onLimit(request, reply);
    } else if (type === 'redis') {
      const { checkAndAdd } = redisImpl;
      const result = await checkAndAdd(`rate:${key}`, windowMs, limit);
      if (!result.allowed) return onLimit(request, reply);
    }
  });
});

import Fastify from 'fastify';
import Redis from 'ioredis';
import { fastifyPlugin } from '../src/index.js';

const fastify = Fastify({ logger: true });
const redis = new Redis({
  host: 'localhost',
  port: 6379,
});

// Redis-based distributed rate limiting
await fastify.register(fastifyPlugin, {
  type: 'redis',
  redisClient: redis,
  windowMs: 60 * 1000, // 1 minute
  limit: 10,
  onLimit: (request, reply) => {
    reply.code(429).send({ error: 'Rate limit exceeded' });
  },
});

fastify.get('/', async () => ({ hello: 'world' }));

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

import Fastify from 'fastify';
import Redis from 'ioredis';
import { fastifyRateLimitRedis } from '@hariom-jha/rate-limiter';

const fastify = Fastify({ logger: true });
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

// Register Redis-based rate limiting plugin
// Allows 200 requests per minute per IP (distributed)
await fastify.register(fastifyRateLimitRedis, {
  redisClient: redis,
  windowMs: 60000, // 1 minute
  maxRequests: 200,
  message: 'Rate limit exceeded. Please try again in a minute.',
});

fastify.get('/', async (request, reply) => {
  return { 
    message: 'Fastify with Redis rate limiting!',
    info: 'Distributed rate limiting across multiple instances',
  };
});

fastify.get('/api/analytics', async (request, reply) => {
  return { 
    views: 12345,
    users: 678,
    timestamp: Date.now(),
  };
});

// Graceful shutdown
fastify.addHook('onClose', async (instance) => {
  await redis.quit();
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Fastify server with Redis rate limiting running on http://localhost:3000');
    console.log('Rate limit: 200 requests per minute (distributed)');
    console.log('Redis status:', redis.status);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

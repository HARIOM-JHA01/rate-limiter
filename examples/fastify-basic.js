import Fastify from 'fastify';
import { fastifyRateLimit } from '@hariom-jha/rate-limiter';

const fastify = Fastify({ logger: true });

// Register rate limiting plugin
// Allows 10 requests per 15 seconds per IP
await fastify.register(fastifyRateLimit, {
  windowMs: 15000, // 15 seconds
  maxRequests: 10,
  message: 'Too many requests from this IP, please slow down.',
});

fastify.get('/', async (request, reply) => {
  return { 
    message: 'Hello from Fastify!',
    info: 'This endpoint is rate limited to 10 requests per 15 seconds',
  };
});

fastify.get('/api/users', async (request, reply) => {
  return { 
    users: [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ],
  };
});

fastify.post('/api/data', async (request, reply) => {
  return { 
    success: true,
    data: request.body,
    timestamp: Date.now(),
  };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Fastify server running on http://localhost:3000');
    console.log('Rate limit: 10 requests per 15 seconds');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

import Fastify from 'fastify';
import { fastifyPlugin } from '../src/index.js';

const fastify = Fastify({ logger: true });

// Basic in-memory rate limiting
await fastify.register(fastifyPlugin, {
  type: 'in-memory',
  inMemory: {
    capacity: 10,
    refillRate: 1,
  },
  onLimit: (request, reply) => {
    reply.code(429).send({ error: 'Too many requests' });
  },
});

fastify.get('/', async () => ({ hello: 'world' }));

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

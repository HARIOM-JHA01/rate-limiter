---
sidebar_position: 3
---

# Fastify Guide

Learn how to use rate limiting with Fastify applications.

## Installation

```bash
npm install @hariom-jha/rate-limiter fastify
```

## Basic Usage

### In-Memory Rate Limiting

Best for single-server deployments or development:

```javascript
import Fastify from 'fastify';
import { fastifyRateLimit } from '@hariom-jha/rate-limiter';

const fastify = Fastify({ logger: true });

// Register rate limiting plugin globally
await fastify.register(fastifyRateLimit, {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

fastify.get('/api/data', async (request, reply) => {
  return { data: 'some data' };
});

await fastify.listen({ port: 3000 });
```

### Redis-Based Rate Limiting

Best for production multi-server deployments:

```javascript
import Fastify from 'fastify';
import Redis from 'ioredis';
import { fastifyRateLimitRedis } from '@hariom-jha/rate-limiter';

const fastify = Fastify({ logger: true });
const redis = new Redis();

await fastify.register(fastifyRateLimitRedis, {
  redisClient: redis,
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: 'Too many requests, please try again later.',
});

fastify.get('/api/data', async (request, reply) => {
  return { data: 'some data' };
});

await fastify.listen({ port: 3000 });
```

## Route-Specific Rate Limiting

Apply different rate limits to different routes using scoped plugins:

```javascript
import Fastify from 'fastify';
import { fastifyRateLimit } from '@hariom-jha/rate-limiter';

const fastify = Fastify({ logger: true });

// Strict rate limit for auth routes
fastify.register(async (authRoutes) => {
  await authRoutes.register(fastifyRateLimit, {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5, // Only 5 attempts per 15 minutes
  });

  authRoutes.post('/login', async (request, reply) => {
    return { token: 'jwt-token' };
  });
}, { prefix: '/auth' });

// Relaxed rate limit for API routes
fastify.register(async (apiRoutes) => {
  await apiRoutes.register(fastifyRateLimit, {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
  });

  apiRoutes.get('/users', async (request, reply) => {
    return { users: [] };
  });

  apiRoutes.get('/posts', async (request, reply) => {
    return { posts: [] };
  });
}, { prefix: '/api' });

await fastify.listen({ port: 3000 });
```

## Custom Key Generator

By default, rate limiting is per IP address. You can customize this:

```javascript
import Fastify from 'fastify';
import { fastifyRateLimit } from '@hariom-jha/rate-limiter';

const fastify = Fastify({ logger: true });

// Rate limit by user ID instead of IP
await fastify.register(fastifyRateLimit, {
  windowMs: 60000,
  maxRequests: 100,
  keyGenerator: (request) => {
    // Use user ID from authentication
    return request.user?.id || request.ip;
  },
});

await fastify.listen({ port: 3000 });
```

## Custom Error Handling

Customize the response when rate limit is exceeded:

```javascript
await fastify.register(fastifyRateLimit, {
  windowMs: 60000,
  maxRequests: 10,
  handler: async (request, reply) => {
    reply.status(429).send({
      statusCode: 429,
      error: 'Too Many Requests',
      message: 'You have exceeded the rate limit. Please try again later.',
      retryAfter: 60, // seconds
    });
  },
});
```

## Skip Certain Requests

Skip rate limiting for certain conditions:

```javascript
await fastify.register(fastifyRateLimit, {
  windowMs: 60000,
  maxRequests: 100,
  skip: (request) => {
    // Skip rate limiting for admin users
    return request.user?.role === 'admin';
  },
});
```

## Using with Decorators

Access rate limit information in your routes:

```javascript
fastify.get('/api/status', async (request, reply) => {
  // Rate limit info is available on the request
  return {
    rateLimit: {
      remaining: request.rateLimit?.remaining,
      limit: request.rateLimit?.limit,
      resetTime: request.rateLimit?.resetTime,
    },
  };
});
```

## Complete Example

Here's a complete Fastify application with rate limiting:

```javascript
import Fastify from 'fastify';
import Redis from 'ioredis';
import { fastifyRateLimitRedis, fastifyRateLimit } from '@hariom-jha/rate-limiter';

const fastify = Fastify({ 
  logger: {
    level: 'info',
  },
});

const redis = new Redis();

// Global distributed rate limit
await fastify.register(fastifyRateLimitRedis, {
  redisClient: redis,
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
});

// Auth routes with strict rate limiting
fastify.register(async (authRoutes) => {
  await authRoutes.register(fastifyRateLimit, {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
    message: 'Too many login attempts',
  });

  authRoutes.post('/login', async (request, reply) => {
    // Handle login
    return { token: 'jwt-token' };
  });

  authRoutes.post('/register', async (request, reply) => {
    // Handle registration
    return { success: true };
  });
}, { prefix: '/auth' });

// API routes
fastify.get('/api/data', async (request, reply) => {
  return { data: 'protected data' };
});

fastify.get('/health', async (request, reply) => {
  return { 
    status: 'ok',
    redis: redis.status,
  };
});

// Graceful shutdown
fastify.addHook('onClose', async (instance) => {
  await redis.quit();
});

// Start server
try {
  await fastify.listen({ port: 3000, host: '0.0.0.0' });
  console.log('Server running on http://localhost:3000');
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
```

## Next Steps

- Learn about [Configuration Options](./configuration)
- See more [Examples](./examples)
- Check the [API Reference](./api)

---
sidebar_position: 1
---

# Getting Started

Get started with **@hariom-jha/rate-limiter** in less than 5 minutes.

## What is Rate Limiter?

**@hariom-jha/rate-limiter** is a production-ready rate limiting library for Node.js applications. It provides:

- 🚀 **High Performance** - Optimized algorithms for minimal overhead
- 🔄 **Multiple Algorithms** - Token bucket (in-memory) and Sliding window (Redis)
- ⚡ **Framework Support** - First-class support for Express and Fastify
- 🌍 **Distributed** - Redis-based rate limiting works across multiple instances
- 📦 **Zero Dependencies** (for in-memory) - Lightweight and fast
- 🛡️ **Production Ready** - Battle-tested and reliable

## Installation

```bash
npm install @hariom-jha/rate-limiter
```

### Optional Dependencies

For Redis-based distributed rate limiting:

```bash
npm install ioredis
```

For framework-specific usage:

```bash
# Express
npm install express

# Fastify  
npm install fastify
```

## Quick Start

### Express (In-Memory)

```javascript
import express from 'express';
import { expressRateLimit } from '@hariom-jha/rate-limiter';

const app = express();

// Apply rate limiting middleware
app.use(expressRateLimit({
  windowMs: 60000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  message: 'Too many requests, please try again later.',
}));

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(3000);
```

### Fastify (In-Memory)

```javascript
import Fastify from 'fastify';
import { fastifyRateLimit } from '@hariom-jha/rate-limiter';

const fastify = Fastify();

// Register rate limiting plugin
await fastify.register(fastifyRateLimit, {
  windowMs: 60000, // 1 minute  
  maxRequests: 100, // 100 requests per minute
  message: 'Too many requests, please try again later.',
});

fastify.get('/', async (request, reply) => {
  return { message: 'Hello World!' };
});

await fastify.listen({ port: 3000 });
```

### Redis (Distributed)

For distributed rate limiting across multiple server instances:

```javascript
import express from 'express';
import Redis from 'ioredis';
import { expressRateLimitRedis } from '@hariom-jha/rate-limiter';

const app = express();
const redis = new Redis();

app.use(expressRateLimitRedis({
  redisClient: redis,
  windowMs: 60000,
  maxRequests: 100,
}));

app.listen(3000);
```

## Next Steps

- Check out the [**Express Guide**](./express) for detailed Express usage
- Check out the [**Fastify Guide**](./fastify) for detailed Fastify usage  
- Learn about [**Configuration Options**](./configuration)
- View [**Examples**](./examples) for common use cases
- Explore the [**API Reference**](./api)

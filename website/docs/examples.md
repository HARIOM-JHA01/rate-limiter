---
sidebar_position: 6
---

# Examples

Common use cases and examples for implementing rate limiting.

## Basic Rate Limiting

Limit all requests to 100 per hour.

### Express

```javascript
import express from 'express';
import { expressRateLimit } from '@hariom-jha/rate-limiter';

const app = express();

app.use(expressRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 100
}));
```

### Fastify

```javascript
import Fastify from 'fastify';
import { fastifyRateLimit } from '@hariom-jha/rate-limiter';

const fastify = Fastify();

await fastify.register(fastifyRateLimit, {
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 100
});
```

## Distributed Rate Limiting with Redis

Use Redis to share rate limits across multiple server instances.

### Express

```javascript
import express from 'express';
import Redis from 'ioredis';
import { expressRateLimitRedis } from '@hariom-jha/rate-limiter';

const app = express();
const redis = new Redis();

app.use(expressRateLimitRedis({
  redisClient: redis,
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 50
}));
```

### Fastify

```javascript
import Fastify from 'fastify';
import Redis from 'ioredis';
import { fastifyRateLimitRedis } from '@hariom-jha/rate-limiter';

const fastify = Fastify();
const redis = new Redis();

await fastify.register(fastifyRateLimitRedis, {
  redisClient: redis,
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 50
});
```

## Custom Key Generator (User ID)

Rate limit based on authenticated User ID instead of IP address.

```javascript
const limiter = expressRateLimit({
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
  keyGenerator: (req) => {
    // Assuming req.user is populated by auth middleware
    return req.user ? req.user.id : req.ip;
  }
});
```

## Whitelisting / Skipping

Skip rate limiting for specific IPs or admin users.

```javascript
const limiter = expressRateLimit({
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
  skip: (req) => {
    const trustedIPs = ['127.0.0.1', '::1'];
    return trustedIPs.includes(req.ip) || (req.user && req.user.isAdmin);
  }
});
```

## Custom Error Response

Return a JSON object with more details when the limit is exceeded.

```javascript
const limiter = expressRateLimit({
  windowMs: 60 * 1000,
  maxRequests: 5,
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'Too many requests, please try again later.',
      retryAfter: '1 minute'
    });
  }
});
```

---
sidebar_position: 4
---

# API Reference

Complete API documentation for all rate limiting functions and options.

## Express Middleware

### `expressRateLimit(options)`

Creates an Express middleware for in-memory token bucket rate limiting.

**Parameters:**
- `options` (Object)
  - `windowMs` (number) - Time window in milliseconds. Default: `60000` (1 minute)
  - `maxRequests` (number) - Maximum number of requests per window. Default: `100`
  - `message` (string) - Error message when rate limit exceeded. Default: `'Too many requests'`
  - `keyGenerator` (function) - Function to generate rate limit key. Default: `(req) => req.ip`
  - `handler` (function) - Custom handler when rate limit exceeded
  - `skip` (function) - Function to skip rate limiting for certain requests

**Returns:** Express middleware function

**Example:**
```javascript
import { expressRateLimit } from '@hariom-jha/rate-limiter';

const limiter = expressRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: 'Too many requests, please slow down',
});

app.use(limiter);
```

### `expressRateLimitRedis(options)`

Creates an Express middleware for Redis-based sliding window rate limiting.

**Parameters:**
- `options` (Object)
  - `redisClient` (Redis) - **Required**. Instance of ioredis client
  - `windowMs` (number) - Time window in milliseconds. Default: `60000`
  - `maxRequests` (number) - Maximum number of requests per window. Default: `100`
  - `message` (string) - Error message when rate limit exceeded
  - `keyGenerator` (function) - Function to generate rate limit key
  - `handler` (function) - Custom handler when rate limit exceeded
  - `skip` (function) - Function to skip rate limiting

**Returns:** Express middleware function

**Example:**
```javascript
import Redis from 'ioredis';
import { expressRateLimitRedis } from '@hariom-jha/rate-limiter';

const redis = new Redis();

const limiter = expressRateLimitRedis({
  redisClient: redis,
  windowMs: 60000,
  maxRequests: 100,
});

app.use(limiter);
```

## Fastify Plugin

### `fastifyRateLimit`

Fastify plugin for in-memory token bucket rate limiting.

**Options:**
- `windowMs` (number) - Time window in milliseconds. Default: `60000`
- `maxRequests` (number) - Maximum number of requests per window. Default: `100`
- `message` (string) - Error message when rate limit exceeded
- `keyGenerator` (function) - Function to generate rate limit key. Default: `(request) => request.ip`
- `handler` (function) - Custom handler when rate limit exceeded
- `skip` (function) - Function to skip rate limiting

**Example:**
```javascript
import { fastifyRateLimit } from '@hariom-jha/rate-limiter';

await fastify.register(fastifyRateLimit, {
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
});
```

### `fastifyRateLimitRedis`

Fastify plugin for Redis-based sliding window rate limiting.

**Options:**
- `redisClient` (Redis) - **Required**. Instance of ioredis client
- `windowMs` (number) - Time window in milliseconds. Default: `60000`
- `maxRequests` (number) - Maximum number of requests per window. Default: `100`
- `message` (string) - Error message when rate limit exceeded
- `keyGenerator` (function) - Function to generate rate limit key
- `handler` (function) - Custom handler when rate limit exceeded
- `skip` (function) - Function to skip rate limiting

**Example:**
```javascript
import Redis from 'ioredis';
import { fastifyRateLimitRedis } from '@hariom-jha/rate-limiter';

const redis = new Redis();

await fastify.register(fastifyRateLimitRedis, {
  redisClient: redis,
  windowMs: 60000,
  maxRequests: 100,
});
```

## Low-Level APIs

### `createInMemoryTokenBucket(options)`

Creates a token bucket rate limiter instance.

**Parameters:**
- `options` (Object)
  - `windowMs` (number) - Refill window in milliseconds
  - `maxTokens` (number) - Maximum tokens (requests) per window

**Returns:** Object with `consume(key)` method

**Example:**
```javascript
import { createInMemoryTokenBucket } from '@hariom-jha/rate-limiter';

const bucket = createInMemoryTokenBucket({
  windowMs: 60000,
  maxTokens: 100,
});

const result = bucket.consume('user-123');
// result = { allowed: true, remaining: 99 }
```

### `createRedisSlidingWindow(options)`

Creates a Redis-based sliding window rate limiter instance.

**Parameters:**
- `options` (Object)
  - `redisClient` (Redis) - Instance of ioredis client

**Returns:** Object with `checkAndAdd(key, windowMs, limit)` method

**Example:**
```javascript
import Redis from 'ioredis';
import { createRedisSlidingWindow } from '@hariom-jha/rate-limiter';

const redis = new Redis();
const limiter = createRedisSlidingWindow({ redisClient: redis });

const result = await limiter.checkAndAdd('user-123', 60000, 100);
// result = { allowed: true, count: 1 }
```

## Common Configuration Options

### windowMs

Time window in milliseconds for rate limiting.

**Type:** `number`  
**Default:** `60000` (1 minute)

Common values:
- `1000` - 1 second
- `60000` - 1 minute
- `900000` - 15 minutes
- `3600000` - 1 hour

### maxRequests

Maximum number of requests allowed per window.

**Type:** `number`  
**Default:** `100`

### keyGenerator

Function to determine the rate limit key (usually IP or user ID).

**Type:** `(req) => string`  
**Default:** `(req) => req.ip`

**Examples:**

By IP (default):
```javascript
keyGenerator: (req) => req.ip
```

By user ID:
```javascript
keyGenerator: (req) => req.user?.id || req.ip
```

By API key:
```javascript
keyGenerator: (req) => req.headers['x-api-key'] || req.ip
```

### handler

Custom handler function called when rate limit is exceeded.

**Type:** `(req, res) => void` (Express) or `(request, reply) => Promise<void>` (Fastify)

**Express Example:**
```javascript
handler: (req, res) => {
  res.status(429).json({
    error: 'Rate limit exceeded',
    retryAfter: 60,
  });
}
```

**Fastify Example:**
```javascript
handler: async (request, reply) => {
  reply.status(429).send({
    error: 'Rate limit exceeded',
    retryAfter: 60,
  });
}
```

### skip

Function to conditionally skip rate limiting.

**Type:** `(req) => boolean`

**Examples:**

Skip for authenticated admin users:
```javascript
skip: (req) => req.user?.role === 'admin'
```

Skip for specific IPs:
```javascript
skip: (req) => {
  const whitelist = ['127.0.0.1', '::1'];
  return whitelist.includes(req.ip);
}
```

Skip for health checks:
```javascript
skip: (req) => req.path === '/health'
```

## Response Headers

When rate limiting is active, the following headers are added to responses:

- `X-RateLimit-Limit` - Maximum requests per window
- `X-RateLimit-Remaining` - Remaining requests in current window
- `X-RateLimit-Reset` - Timestamp when the window resets (Unix timestamp in seconds)

**Example Response:**
```
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1701234567
```

When limit is exceeded:
```
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1701234567
Retry-After: 45
```

## Error Handling

### HTTP 429 Response

When rate limit is exceeded, a `429 Too Many Requests` status is returned.

**Default Response:**
```json
{
  "error": "Too Many Requests",
  "message": "Too many requests, please try again later."
}
```

### Custom Error Responses

You can customize error responses using the `handler` option:

```javascript
const limiter = expressRateLimit({
  windowMs: 60000,
  maxRequests: 100,
  handler: (req, res) => {
    const resetTime = Math.ceil((Date.now() + 60000) / 1000);
    
    res.status(429).json({
      statusCode: 429,
      error: 'Too Many Requests',
      message: 'You have exceeded the rate limit',
      limit: 100,
      remaining: 0,
      resetTime: resetTime,
      retryAfter: 60,
    });
  },
});
```

## Best Practices

1. **Use Redis for Production**: For multi-server deployments, always use Redis-based rate limiting
2. **Set Appropriate Limits**: Balance security with user experience
3. **Different Limits for Different Routes**: Apply stricter limits to sensitive endpoints
4. **Whitelist Trusted IPs**: Skip rate limiting for internal services
5. **Monitor Rate Limit Metrics**: Track how often limits are hit
6. **Graceful Degradation**: Handle Redis connection failures appropriately
7. **Clear Error Messages**: Provide helpful messages to users

## TypeScript Support

The library includes TypeScript type definitions:

```typescript
import type { 
  RateLimitOptions,
  RateLimitRedisOptions,
  TokenBucketOptions,
} from '@hariom-jha/rate-limiter';

const options: RateLimitOptions = {
  windowMs: 60000,
  maxRequests: 100,
};
```

---
sidebar_position: 2
---

# Express Guide

Learn how to use rate limiting with Express.js applications.

## Installation

```bash
npm install @hariom-jha/rate-limiter express
```

## Basic Usage

### In-Memory Rate Limiting

Best for single-server deployments or development:

```javascript
import express from 'express';
import { expressRateLimit } from '@hariom-jha/rate-limiter';

const app = express();

// Global rate limit for all routes
app.use(expressRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
}));

app.get('/api/data', (req, res) => {
  res.json({ data: 'some data' });
});

app.listen(3000);
```

### Redis-Based Rate Limiting

Best for production multi-server deployments:

```javascript
import express from 'express';
import Redis from 'ioredis';
import { expressRateLimitRedis } from '@hariom-jha/rate-limiter';

const app = express();
const redis = new Redis();

app.use(expressRateLimitRedis({
  redisClient: redis,
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: 'Too many requests, please try again later.',
}));

app.get('/api/data', (req, res) => {
  res.json({ data: 'some data' });
});

app.listen(3000);
```

## Route-Specific Rate Limiting

Apply different rate limits to different routes:

```javascript
import express from 'express';
import { expressRateLimit } from '@hariom-jha/rate-limiter';

const app = express();

// Strict rate limit for authentication endpoints
const authLimiter = expressRateLimit({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5, // Only 5 login attempts per 15 minutes
  message: 'Too many login attempts, please try again later.',
});

// Relaxed rate limit for general API
const apiLimiter = expressRateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
});

app.post('/auth/login', authLimiter, (req, res) => {
  // Handle login
  res.json({ success: true });
});

app.get('/api/users', apiLimiter, (req, res) => {
  res.json({ users: [] });
});

app.listen(3000);
```

## Custom Key Generator

By default, rate limiting is per IP address. You can customize this:

```javascript
import express from 'express';
import { expressRateLimit } from '@hariom-jha/rate-limiter';

const app = express();

// Rate limit by user ID instead of IP
const userLimiter = expressRateLimit({
  windowMs: 60000,
  maxRequests: 100,
  keyGenerator: (req) => {
    // Use user ID from authentication
    return req.user?.id || req.ip;
  },
});

app.use(userLimiter);

app.listen(3000);
```

## Custom Error Handling

Customize the response when rate limit is exceeded:

```javascript
const limiter = expressRateLimit({
  windowMs: 60000,
  maxRequests: 10,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: 60, // seconds
      message: 'You have made too many requests. Please wait before trying again.',
    });
  },
});
```

## Skip Certain Requests

Skip rate limiting for certain conditions:

```javascript
const limiter = expressRateLimit({
  windowMs: 60000,
  maxRequests: 100,
  skip: (req) => {
    // Skip rate limiting for admin users
    return req.user?.role === 'admin';
  },
});
```

## Complete Example

Here's a complete Express application with rate limiting:

```javascript
import express from 'express';
import Redis from 'ioredis';
import { expressRateLimitRedis, expressRateLimit } from '@hariom-jha/rate-limiter';

const app = express();
const redis = new Redis();

// Global rate limit (distributed)
app.use(expressRateLimitRedis({
  redisClient: redis,
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
}));

// Strict rate limit for auth
const authLimiter = expressRateLimit({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
  message: 'Too many login attempts',
});

// API routes
app.post('/auth/login', authLimiter, (req, res) => {
  // Handle login
  res.json({ token: 'jwt-token' });
});

app.get('/api/data', (req, res) => {
  res.json({  data: 'protected data' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await redis.quit();
  process.exit(0);
});
```

## Next Steps

- Learn about [Configuration Options](./configuration)
- See more [Examples](./examples)
- Check the [API Reference](./api)

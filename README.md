# @hariom-jha/rate-limiter

Production-ready rate limiter with in-memory token-bucket and Redis sliding-window algorithms for Express and Fastify.

[![npm version](https://img.shields.io/npm/v/@hariom-jha/rate-limiter.svg)](https://www.npmjs.com/package/@hariom-jha/rate-limiter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **High Performance** - Optimized algorithms with minimal overhead
- 🔄 **Multiple Algorithms** - Token bucket (in-memory) and Sliding window (Redis)
- ⚡ **Framework Support** - First-class support for Express and Fastify
- 🌍 **Distributed** - Redis-based rate limiting works across multiple server instances
- 📦 **Zero Dependencies** (for in-memory) - Lightweight and fast
- 🛡️ **Production Ready** - Battle-tested and reliable
- 📝 **TypeScript Support** - Full type definitions included

## Installation

```bash
npm install @hariom-jha/rate-limiter
```

Optional dependencies:

```bash
# For Redis-based distributed rate limiting
npm install ioredis

# For framework usage
npm install express  # or fastify
```

## Quick Start

### Express

```javascript
import express from 'express';
import { expressRateLimit } from '@hariom-jha/rate-limiter';

const app = express();

// Apply rate limiting: 100 requests per minute
app.use(expressRateLimit({
  windowMs: 60000,
  maxRequests: 100,
}));

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(3000);
```

### Fastify

```javascript
import Fastify from 'fastify';
import { fastifyRateLimit } from '@hariom-jha/rate-limiter';

const fastify = Fastify();

// Register rate limiting plugin
await fastify.register(fastifyRateLimit, {
  windowMs: 60000,
  maxRequests: 100,
});

fastify.get('/', async () => {
  return { message: 'Hello World!' };
});

await fastify.listen({ port: 3000 });
```

### Redis (Distributed)

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
```

## Documentation

📚 **[Full Documentation](https://hariom-jha01.github.io/rate-limiter/)**

- [Getting Started](https://hariom-jha01.github.io/rate-limiter/docs/intro)
- [Express Guide](https://hariom-jha01.github.io/rate-limiter/docs/express)
- [Fastify Guide](https://hariom-jha01.github.io/rate-limiter/docs/fastify)
- [API Reference](https://hariom-jha01.github.io/rate-limiter/docs/api)

## Examples

See the [`examples/`](./examples) directory for complete working examples:

- [Express Basic](./examples/express-basic.js) - In-memory rate limiting
- [Express Redis](./examples/express-redis.js) - Distributed rate limiting  
- [Fastify Basic](./examples/fastify-basic.js) - In-memory rate limiting
- [Fastify Redis](./examples/fastify-redis.js) - Distributed rate limiting

## Configuration

### Common Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `windowMs` | number | `60000` | Time window in milliseconds |
| `maxRequests` | number | `100` | Max requests per window |
| `message` | string | `'Too many requests'` | Error message when limited |
| `keyGenerator` | function | `(req) => req.ip` | Function to generate rate limit key |
| `skip` | function | - | Skip rate limiting for certain requests |
| `handler` | function | - | Custom error handler |

### Redis Options

For Redis-based rate limiting, additionally provide:

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `redisClient` | Redis | ✓ | ioredis client instance |

## Development

### Running Tests

**Unit Tests (no Redis required):**
```bash
npm test
```

**Integration Tests (requires Redis):**
```bash
# Start Redis with Docker
npm run docker:up

# Run integration tests
npm run test:integration

# Or run ALL tests (unit + integration)
npm run test:all

# Stop Redis when done
npm run docker:down
```

**Linting:**
```bash
npm run lint
```

### Manual Docker Commands

If you prefer manual control:
```bash
# Start Redis
docker-compose up -d

# Check if Redis is running
docker ps

# View Redis logs
docker-compose logs -f redis

# Stop Redis
docker-compose down
```

## Available Scripts

- `npm test` - Run unit tests (skips Redis tests)
- `npm run test:integration` - Run only Redis integration tests
- `npm run test:all` - Run all tests including integration tests
- `npm run lint` - Run ESLint
- `npm run docker:up` - Start Redis in Docker
- `npm run docker:down` - Stop Redis Docker container

See `./docs` in future for more details.

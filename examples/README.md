# Examples

This directory contains practical examples demonstrating how to use the rate limiter in different scenarios.

## Available Examples

### Express

- **`express-basic.js`** - Basic in-memory rate limiting with Express
- **`express-redis.js`** - Redis-based distributed rate limiting with Express

### Fastify

- **`fastify-basic.js`** - Basic in-memory rate limiting with Fastify
- **`fastify-redis.js`** - Redis-based distributed rate limiting with Fastify

## Running Examples

### Prerequisites

Make sure you have the package installed:

```bash
npm install @hariom-jha/rate-limiter express fastify ioredis
```

### Running Basic Examples (No Redis Required)

```bash
# Express basic example
node examples/express-basic.js

# Fastify basic example
node examples/fastify-basic.js
```

Then open your browser or use curl to test:

```bash
curl http://localhost:3000
```

### Running Redis Examples

First, start Redis using Docker:

```bash
docker run -d -p 6379:6379 redis:7-alpine
```

Then run the example:

```bash
# Express with Redis
node examples/express-redis.js

# Fastify with Redis
node examples/fastify-redis.js
```

## Testing Rate Limits

You can test the rate limiting by making multiple requests quickly:

```bash
# Make 10 requests in a loop
for i in {1..10}; do
  curl http://localhost:3000
  echo ""
done
```

You should see successful responses initially, then rate limit errors when the limit is exceeded.

## Customization

All examples can be customized by modifying:

- `windowMs` - Time window in milliseconds
- `maxRequests` - Maximum number of requests allowed in the window
- `message` - Custom error message when rate limit is exceeded

For Redis examples, you can also configure:

- `REDIS_HOST` - Redis server host (default: localhost)
- `REDIS_PORT` - Redis server port (default: 6379)

Example:

```bash
REDIS_HOST=redis.example.com REDIS_PORT=6380 node examples/express-redis.js
```

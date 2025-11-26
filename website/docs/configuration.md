---
sidebar_position: 5
---

# Configuration

This guide details all available configuration options for the rate limiter.

## Common Options

These options are available for both Express and Fastify, and for both in-memory and Redis stores.

### `windowMs`

- **Type**: `number`
- **Default**: `60000` (1 minute)
- **Description**: The time frame for which requests are checked/remembered.

```javascript
// 15 minutes
windowMs: 15 * 60 * 1000
```

### `maxRequests`

- **Type**: `number`
- **Default**: `100`
- **Description**: The maximum number of connections to allow during the `windowMs` before sending a 429 response.

```javascript
// Limit each IP to 100 requests per windowMs
maxRequests: 100
```

### `message`

- **Type**: `string` | `Object`
- **Default**: `'Too many requests, please try again later.'`
- **Description**: The response body sent back when a client hits the rate limit.

```javascript
message: 'You have exceeded the request limit!'
```

### `statusCode`

- **Type**: `number`
- **Default**: `429`
- **Description**: The HTTP status code returned when the limit is exceeded.

### `keyGenerator`

- **Type**: `Function`
- **Default**: `(req) => req.ip`
- **Description**: Function used to generate a unique key for the client. By default, it uses the IP address.

```javascript
keyGenerator: (req) => {
  return req.user ? req.user.id : req.ip;
}
```

### `handler`

- **Type**: `Function`
- **Description**: Function to handle requests once the max limit is reached. It overrides the default behavior of sending the `message` and `statusCode`.

**Express Signature:**
```javascript
handler: (req, res, next) => {
  res.status(429).send('Too many requests');
}
```

**Fastify Signature:**
```javascript
handler: async (request, reply) => {
  reply.status(429).send({ error: 'Too Many Requests' });
}
```

### `skip`

- **Type**: `Function`
- **Default**: `() => false`
- **Description**: Function used to skip rate limiting for certain requests. Returns `true` to skip.

```javascript
skip: (req) => {
  // Skip for local requests
  return req.ip === '127.0.0.1';
}
```

## Redis Specific Options

These options are only applicable when using the Redis store.

### `redisClient`

- **Type**: `Redis` (ioredis instance)
- **Required**: Yes
- **Description**: The ioredis client instance to use for storing rate limit data.

```javascript
import Redis from 'ioredis';
const redis = new Redis();

// ...
redisClient: redis
```

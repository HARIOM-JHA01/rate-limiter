import express from 'express';
import Redis from 'ioredis';
import { expressRateLimitRedis } from '@hariom-jha/rate-limiter';

const app = express();
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

// Apply Redis-based rate limiting middleware
// Allows 100 requests per minute per IP
app.use(expressRateLimitRedis({
  redisClient: redis,
  windowMs: 60000, // 1 minute
  maxRequests: 100,
  message: 'Rate limit exceeded. Please try again later.',
}));

app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello! This endpoint uses Redis-based rate limiting.',
    info: 'This works across multiple server instances!',
  });
});

app.get('/api/heavy-operation', (req, res) => {
  // Simulate a resource-intensive operation
  res.json({ 
    result: 'Operation completed',
    timestamp: Date.now(),
    info: 'This endpoint is protected by distributed rate limiting',
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express server with Redis rate limiting running on http://localhost:${PORT}`);
  console.log('Rate limit: 100 requests per minute (distributed across instances)');
  console.log('Redis connection:', redis.status);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await redis.quit();
  process.exit(0);
});

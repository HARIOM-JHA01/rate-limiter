import express from 'express';
import Redis from 'ioredis';
import { expressMiddleware } from '../src/index.js';

const app = express();
const redis = new Redis({
  host: 'localhost',
  port: 6379,
});

// Redis-based distributed rate limiting
app.use(expressMiddleware({
  type: 'redis',
  redisClient: redis,
  windowMs: 60 * 1000, // 1 minute
  limit: 10, // 10 requests per minute
  onLimit: (req, res) => {
    res.status(429).json({ error: 'Rate limit exceeded' });
  },
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

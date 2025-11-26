import express from 'express';
import { expressRateLimit } from '@hariom-jha/rate-limiter';

const app = express();

// Apply rate limiting middleware
// Allows 5 requests per 10 seconds per IP
app.use(expressRateLimit({
  windowMs: 10000, // 10 seconds
  maxRequests: 5,
  message: 'Too many requests, please try again later.',
}));

app.get('/', (req, res) => {
  res.json({ message: 'Hello! This endpoint is rate limited.' });
});

app.get('/api/data', (req, res) => {
  res.json({ data: 'Some important data', timestamp: Date.now() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
  console.log('Rate limit: 5 requests per 10 seconds');
  console.log('Try making multiple requests to see rate limiting in action!');
});

import express from 'express';
import { expressMiddleware } from '../src/index.js';

const app = express();

// Basic in-memory rate limiting
app.use(expressMiddleware({
  type: 'in-memory',
  inMemory: {
    capacity: 10,
    refillRate: 1,
  },
  onLimit: (req, res) => {
    res.status(429).json({ error: 'Too many requests' });
  },
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

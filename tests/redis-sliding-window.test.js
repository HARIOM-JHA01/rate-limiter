// Integration test (skipped by default) - requires Redis
import Redis from 'ioredis';
import createRedisSlidingWindow from '../src/redis-sliding-window.js';

test('redis sliding window basic behaviour', async () => {
  const client = new Redis();
  const rl = createRedisSlidingWindow({ redisClient: client });

  try {
    const key = 'test:1';
    await client.del(key);

    const window = 1000; const limit = 3;
    for (let i = 0; i < 3; i++) {
      const res = await rl.checkAndAdd(key, window, limit);
      expect(res.allowed).toBe(true);
    }

    const res = await rl.checkAndAdd(key, window, limit);
    expect(res.allowed).toBe(false);
  } finally {
    await client.quit();
  }
}, 10000); // Increase timeout to 10s

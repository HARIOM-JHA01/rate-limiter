import Redis from 'ioredis';

// Lua script (sliding window using sorted set) - atomic
const LUA_SCRIPT = `
-- ARGV[1]=now, ARGV[2]=window_ms, ARGV[3]=limit
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])

-- remove old
redis.call('ZREMRANGEBYSCORE', key, 0, now - window)
local count = redis.call('ZCARD', key)
if count + 1 > limit then
  return -1
end
redis.call('ZADD', key, now, now)
redis.call('PEXPIRE', key, window)
return count + 1
`;

export default function createRedisSlidingWindow({ redisClient } = {}) {
  const client = redisClient || new Redis();

  async function checkAndAdd(key, windowMs, limit) {
    const now = Date.now();
    // Using EVAL directly for portability; in prod you can SCRIPT LOAD + EVALSHA
    const res = await client.eval(LUA_SCRIPT, 1, key, now, windowMs, limit);
    const count = Number(res);
    return { allowed: count > 0, count: count > 0 ? count : limit };
  }

  async function quit() {
    if (!redisClient) await client.quit();
  }

  return { checkAndAdd, quit };
}

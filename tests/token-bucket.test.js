import createInMemoryTokenBucket from '../src/token-bucket.js';

test('token bucket allows up to capacity and refills over time', () => {
  const impl = createInMemoryTokenBucket({ capacity: 5, refillRate: 1 });
  const b = impl.getBucket('a');

  // consume 5
  for (let i = 0; i < 5; i++) expect(b.tryRemoveToken()).toBe(true);
  expect(b.tryRemoveToken()).toBe(false);

  // simulate time passage
  b.lastRefill -= 2000;
  b._refill();
  const state = b.getState();
  expect(state.tokens).toBeGreaterThanOrEqual(1);
});

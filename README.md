# @hariom-jha/rate-limiter

Production-ready rate limiter with in-memory token-bucket and Redis sliding-window.

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

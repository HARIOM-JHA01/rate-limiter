# Rate Limiter Documentation Website

This directory contains the Docusaurus-based documentation website for @hariom-jha/rate-limiter.

## Installation

```bash
cd website
npm install
```

## Local Development

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

The documentation is automatically deployed to GitHub Pages when changes are pushed to the main branch.

Manual deployment:

```bash
GIT_USER=<Your GitHub username> npm run deploy
```

## Documentation Structure

- `/docs` - Documentation pages
  - `intro.md` - Getting Started guide
  - `express.md` - Express integration guide
  - `fastify.md` - Fastify integration guide
  - `api.md` - Complete API reference
- `/src` - Custom React components and pages
- `/static` - Static assets like images

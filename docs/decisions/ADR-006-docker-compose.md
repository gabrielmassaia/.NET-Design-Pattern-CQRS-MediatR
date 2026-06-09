---
status: Accepted
date: 2026-06
tags: docker, infrastructure, deployment
---

# ADR-006: Use Docker Compose with 5 Services

## Context

The application has multiple infrastructure dependencies (PostgreSQL, Redis, Meilisearch) and needs a consistent way to run in development, testing, and production.

## Decision

Use **Docker Compose** with 5 services:

1. **db** — PostgreSQL 16 Alpine
2. **redis** — Redis 7 Alpine
3. **meilisearch** — Meilisearch 1.9
4. **api** — .NET 9 multi-stage Dockerfile
5. **web** — Node 20 build → Nginx serve SPA

## Consequences

**Positive:**
- Single command to start the entire stack
- Consistent environment across machines
- Health checks ensure API waits for database
- Nginx handles SPA routing and API proxying

**Negative:**
- Requires Docker Desktop or compatible runtime
- Build times for Docker images on first run

## Compliance

See: `docker-compose.yml`, `docs/shared/docker-compose.md`

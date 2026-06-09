---
status: Accepted
date: 2026-06
tags: caching, redis, performance
---

# ADR-004: Use Redis for Dashboard and Alerts Caching

## Context

Dashboard and alerts endpoints aggregate data across all companies and obligations. With many companies, these queries become expensive. The data changes infrequently (only on create/delete/entrega operations).

## Decision

Use **Redis 7** with a **Decorator pattern** (`CachedDashboardAppService`) to cache dashboard and alerts responses:

- Dashboard: 30-second TTL
- Alerts: 60-second TTL
- Cache key: `dashboard:{year}:{month}` and `alertas:current`
- Invalidation: via cache TTL (eventual consistency)

## Consequences

**Positive:**
- Reduces database load for frequently accessed endpoints
- Decorator pattern preserves Clean Architecture
- Easy to disable caching by removing the decorator

**Negative:**
- Dashboard data may be stale up to 30 seconds
- Requires Redis infrastructure

## Compliance

See: `src/api/PainelObrigacoes.Application/Dashboard/Services/CachedDashboardAppService.cs`

---
created: 2026-06
updated: 2026-06
tags: roadmap, vision
scope: sh
---

# Product Roadmap

> **Painel de Obrigações Acessórias** — Centralized fiscal obligation management for Brazilian accounting firms.

---

## Product Vision

A web-based system that replaces fragile spreadsheets for tracking accessory tax obligations across multiple companies with different tax regimes. It automatically generates obligations based on tax rules, calculates due dates, tracks delivery status, and alerts about upcoming or overdue deadlines.

---

## Implemented Features

| Feature | Status | Description |
|---|---|---|
| Company Management | ✅ Complete | CRUD operations with CNPJ validation, soft delete |
| Tax Regime Support | ✅ Complete | 4 regimes: Simples Nacional, Lucro Presumido, Lucro Real, Imunidade/Isenção |
| Auto Obligation Generation | ✅ Complete | 12 months of obligations generated on company creation |
| Due Date Calculation | ✅ Complete | Business day adjustment for weekend dates |
| Calendar View | ✅ Complete | Filter obligations by month, company, and status |
| Delivery Registration | ✅ Complete | Mark obligations as delivered with date |
| Dashboard | ✅ Complete | Consolidated statistics (totals, pending, delivered, overdue) |
| Alert Panel | ✅ Complete | 30-day lookahead + overdue alerts, sorted by urgency |
| Redis Caching | ✅ Complete | Dashboard/Alerts cached with 30s/60s TTL |
| Meilisearch Search | ✅ Complete | Full-text empresa search with debounce |
| Docker Compose | ✅ Complete | 5 services: DB, Redis, Meilisearch, API, Web |
| Exception Middleware | ✅ Complete | Global error handling (Validation → 400, Conflict → 409, NotFound → 404) |
| Domain Events | ✅ Complete | MediatR INotification for search indexing side effects |
| Smart Obligation Generation | ✅ Complete | Geração a partir do mês atual ao cadastrar empresa, evitando atrasos artificiais |
| Year Rollover | ✅ Complete | `YearRolloverService` gera automaticamente obrigações do novo ano para todas as empresas ativas |
| Backend Tests | ✅ Complete | 90 unit tests across Domain, Application, and Infrastructure layers |
| Frontend Tests | ✅ Complete | 33+ unit tests across components, hooks, services, and utils |

---

## Backlog

| Feature | Priority | Notes |
|---|---|---|
| Holiday Provider | Medium | Extend `IBusinessDayAdjuster` with Brazilian national holidays |
| Year Selection in Calendar | Medium | Allow navigating across years |
| Export to Excel/PDF | Low | Export obligation lists for offline use |
| Multi-User Support | Low | Future: authentication, company assignment |
| E2E Tests | Low | Playwright/Cypress tests for frontend flows |
| CI/CD Pipeline | Low | GitHub Actions for automated build + test |
| Frontend Tests | Low | Vitest + React Testing Library setup |

---

## Architecture Decision Records

All significant architectural decisions are documented in [docs/decisions/](decisions/):

| ADR | Decision |
|---|---|
| [ADR-001](decisions/ADR-001-clean-architecture.md) | Adopt Clean Architecture with 6 .NET projects |
| [ADR-002](decisions/ADR-002-mediatr-cqrs.md) | Use MediatR for CQRS with FluentValidation pipeline |
| [ADR-003](decisions/ADR-003-postgresql-efcore.md) | PostgreSQL 16 + EF Core 9 for data access |
| [ADR-004](decisions/ADR-004-redis-cache.md) | Redis for dashboard and alerts caching |
| [ADR-005](decisions/ADR-005-meilisearch.md) | Meilisearch for full-text empresa search |
| [ADR-006](decisions/ADR-006-docker-compose.md) | Docker Compose with 5 services |

---

## Key Decisions Made

| Decision | Choice | Rationale |
|---|---|---|
| Authentication | None | Not required for the technical case |
| National Holidays | Ignored in v1 | Extensible via `IBusinessDayAdjuster` interface |
| NaoAplicavel Status | Not generated | Engine returns empty array for exempt regimes |
| Obligation Generation | On company creation | 12 months of current year auto-generated |
| Soft vs Hard Delete | Empresa: soft, Obrigações: hard | Traceability for companies, no historical value for obligations |

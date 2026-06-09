---
status: Accepted
date: 2026-06
tags: architecture, clean-architecture
---

# ADR-001: Adopt Clean Architecture with 6 Projects

## Context

The application needs a maintainable architecture that separates concerns and allows independent testing of business logic without infrastructure dependencies.

## Decision

Adopt Clean Architecture with 6 .NET projects following strict dependency rules:

```
Api → Application → Domain
Api → IoC → Infrastructure.Data → Domain
```

## Consequences

**Positive:**
- Domain is fully testable without infrastructure
- Clear boundaries between layers
- Easy to swap infrastructure (e.g., PostgreSQL → SQL Server)
- Feature-based organization scales well

**Negative:**
- More boilerplate than a monolithic architecture
- Requires discipline to maintain layer boundaries

## Compliance

See: `docs/architecture.md`, `docs/backend/rules.md`

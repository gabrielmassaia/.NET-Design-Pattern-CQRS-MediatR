---
status: Accepted
date: 2026-06
tags: database, postgresql, ef-core
---

# ADR-003: Use PostgreSQL 16 with Entity Framework Core 9

## Context

The application needs a relational database to store companies, obligations, and related entities. Must support complex queries for dashboard aggregation and alerts.

## Decision

Use **PostgreSQL 16** as the database engine with **EF Core 9** as the ORM, using the **Npgsql** provider.

## Consequences

**Positive:**
- EF Core provides LINQ queries, migrations, and change tracking
- PostgreSQL is open-source, robust, and widely supported
- SplitQuery behavior avoids cartesian explosion in complex queries
- Npgsql enables legacy timestamp behavior for DateTime.Kind=Unspecified compatibility

**Negative:**
- EF Core adds abstraction overhead for simple queries
- Migration management requires tooling

## Compliance

See: `src/api/PainelObrigacoes.Infrastructure.Data/Context/AppDbContext.cs`

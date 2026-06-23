---
status: Accepted
date: 2026-06
tags: search, meilisearch, full-text
---

# ADR-005: Use Meilisearch for Full-Text Company Search

## Context

Users need to search companies by name or CNPJ with typo tolerance and fast response times. PostgreSQL full-text search is possible but adds complexity.

## Decision

Use **Meilisearch 1.9** as a dedicated search engine:

- Companies are indexed on creation (via domain event)
- Removed from index on soft-delete (via domain event)
- Search endpoint with debounced input (300ms) in the frontend
- Typo-tolerant, prefix search out of the box

## Consequences

**Positive:**
- Fast, typo-tolerant search without complex PostgreSQL queries
- Real-time indexing via domain events
- Simple API with `.SearchAsync()`

**Negative:**
- Additional infrastructure service to manage
- Eventual consistency between DB and search index

## Compliance

See: `src/api/CleanArchReference.Infrastructure.Data/Search/MeilisearchEmpresaService.cs`

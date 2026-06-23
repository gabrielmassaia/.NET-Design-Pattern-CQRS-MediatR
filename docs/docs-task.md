# Documentation Implementation Plan — CleanArchReference

> **Total:** 32 files across 5 categories
> **Language:** English
> **Pattern:** YAML frontmatter + Markdown + Mermaid diagrams

---

## Category 1: Root Agent Files (3 files)

| # | File | Description |
|---|---|---|
| 1 | `AGENTS.md` | Master agent persona, rule hierarchy, verification pipeline |
| 2 | `CLAUDE.md` | Claude Code guidance, commands, key files mapping |
| 3 | `.opencode.json` | OpenCode AI context configuration |

## Category 2: Core Documentation (6 files)

| # | File | Scope | Description |
|---|---|---|---|
| 4 | `docs/INDEX.md` | SH | Master navigation hub with Mermaid site map |
| 5 | `docs/GLOSSARY.md` | SH | Domain terminology (obrigações, regimes, status) |
| 6 | `docs/ROADMAP.md` | SH | Product vision, implemented features, backlog |
| 7 | `docs/development-setup.md` | SH | Docker compose, environment, first run |
| 8 | `docs/architecture.md` | SH | C4 diagrams, Clean Architecture deep dive |
| 9 | `docs/tributary-rules-engine.md` | BE | Fiscal rules engine documentation |

## Category 3: Backend Documentation (6 files)

| # | File | Scope | Description |
|---|---|---|---|
| 10 | `docs/backend/rules.md` | BE | .NET conventions, patterns, naming |
| 11 | `docs/backend/endpoints.md` | BE | Endpoint patterns and Minimal API conventions |
| 12 | `docs/backend/domain-events.md` | BE | MediatR INotification events |
| 13 | `docs/backend/response-data.md` | BE | ResponseData<T> envelope contract |
| 14 | `docs/backend/testing/setup.md` | BE | Test project structure and configuration |
| 15 | `docs/backend/testing/best-practices.md` | BE | Testing conventions and examples |

## Category 4: Frontend Documentation (5 files)

| # | File | Scope | Description |
|---|---|---|---|
| 16 | `docs/frontend/architecture.md` | FE | React layers, data flow, component tree |
| 17 | `docs/frontend/rules.md` | FE | TypeScript/React conventions |
| 18 | `docs/frontend/components.md` | FE | Component catalog |
| 19 | `docs/frontend/testing/setup.md` | FE | Frontend test config |
| 20 | `docs/frontend/testing/best-practices.md` | FE | Frontend testing guidelines |

## Category 5: Shared Infrastructure (2 files)

| # | File | Scope | Description |
|---|---|---|---|
| 21 | `docs/shared/docker-compose.md` | SH | Docker services, networking, volumes |
| 22 | `docs/shared/data-seed.md` | SH | Database seeding and migration strategy |

## Category 6: Architecture Decision Records (6 files)

| # | File | Description |
|---|---|---|
| 23 | `docs/decisions/ADR-001-clean-architecture.md` | Clean Architecture with 6 projects |
| 24 | `docs/decisions/ADR-002-mediatr-cqrs.md` | MediatR + CQRS + ValidationBehavior |
| 25 | `docs/decisions/ADR-003-postgresql-efcore.md` | PostgreSQL + EF Core 9 |
| 26 | `docs/decisions/ADR-004-redis-cache.md` | Redis for Dashboard caching |
| 27 | `docs/decisions/ADR-005-meilisearch.md` | Meilisearch for full-text search |
| 28 | `docs/decisions/ADR-006-docker-compose.md` | Docker Compose with 5 services |

## Category 7: Agent Specialists (4 files)

| # | File | Description |
|---|---|---|
| 29 | `agents/specialists/backend-architect.md` | .NET/Clean Architecture specialist |
| 30 | `agents/specialists/frontend-architect.md` | React/TypeScript specialist |
| 31 | `agents/specialists/tributary-engineer.md` | Brazilian fiscal rules specialist |
| 32 | `agents/security/code-reviewer.md` | Code quality and security reviewer |

---

## Expected Directory Tree

```
/
├── AGENTS.md
├── CLAUDE.md
├── .opencode.json
├── docs/
│   ├── INDEX.md
│   ├── GLOSSARY.md
│   ├── ROADMAP.md
│   ├── development-setup.md
│   ├── architecture.md
│   ├── tributary-rules-engine.md
│   ├── backend/
│   │   ├── rules.md
│   │   ├── endpoints.md
│   │   ├── domain-events.md
│   │   ├── response-data.md
│   │   └── testing/
│   │       ├── setup.md
│   │       └── best-practices.md
│   ├── frontend/
│   │   ├── architecture.md
│   │   ├── rules.md
│   │   ├── components.md
│   │   └── testing/
│   │       ├── setup.md
│   │       └── best-practices.md
│   ├── shared/
│   │   ├── docker-compose.md
│   │   └── data-seed.md
│   └── decisions/
│       ├── ADR-001-clean-architecture.md
│       ├── ADR-002-mediatr-cqrs.md
│       ├── ADR-003-postgresql-efcore.md
│       ├── ADR-004-redis-cache.md
│       ├── ADR-005-meilisearch.md
│       └── ADR-006-docker-compose.md
├── agents/
│   ├── specialists/
│   │   ├── backend-architect.md
│   │   ├── frontend-architect.md
│   │   └── tributary-engineer.md
│   └── security/
│       └── code-reviewer.md
```

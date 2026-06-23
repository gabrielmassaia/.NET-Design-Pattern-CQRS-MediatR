# CLAUDE.md — CleanArchReference

## Mandatory Reading Order

Before starting any task, read files in this order:

1. `AGENTS.md` — Master agent rules and persona
2. `docs/INDEX.md` — Documentation index
3. `docs/architecture.md` — Architecture overview
4. `docs/backend/rules.md` — Backend conventions
5. `docs/frontend/rules.md` — Frontend conventions

---

## Project Overview

**CleanArchReference** — Projeto referência de estudo sobre Clean Architecture, CQRS, Design Patterns e boas práticas de desenvolvimento com .NET 9 e React 19. O domínio fiscal (obrigações acessórias) serve como contexto para demonstração dos padrões arquiteturais.

### Tech Stack

| Layer | Technology |
|---|---|
| Backend | .NET 9, ASP.NET Core, EF Core 9, Npgsql |
| CQRS | MediatR 12, FluentValidation 11, AutoMapper 13 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 (StackExchange) |
| Search | Meilisearch 1.9 |
| Frontend | React 19, Vite 6, TypeScript 5 |
| UI Kit | Ant Design 5 |
| State | TanStack Query 5, Axios |
| Infrastructure | Docker Compose, Nginx |
| Tests | xUnit, Moq, FluentAssertions |

---

## Commands

### Backend

```bash
# Build
dotnet build src/api/CleanArchReference.Api/CleanArchReference.Api.csproj

# Run tests
dotnet test src/api/CleanArchReference.Tests/CleanArchReference.Tests.csproj

# Add EF migration
cd src/api && dotnet ef migrations add <Name> --project CleanArchReference.Infrastructure.Data --startup-project CleanArchReference.Api

# Apply migration (local PG required)
cd src/api && dotnet ef database update --project CleanArchReference.Infrastructure.Data --startup-project CleanArchReference.Api
```

### Frontend

```bash
# Dev server
cd src/web && npm run dev

# Build
cd src/web && npm run build

# Lint
cd src/web && npm run lint
```

### Docker

```bash
# Full stack
docker compose up --build -d

# Just database
docker compose up -d db

# Logs
docker compose logs -f api web
```

---

## Key Files

| File | Path |
|---|---|
| Solution | `CleanArchReference.slnx` |
| Entry Point | `src/api/CleanArchReference.Api/Program.cs` |
| DI Setup | `src/api/CleanArchReference.Infrastructure.CrossCutting.IoC/ProjectBootstrapper.cs` |
| DbContext | `src/api/CleanArchReference.Infrastructure.Data/Context/AppDbContext.cs` |
| Seed Data | `src/api/CleanArchReference.Infrastructure.Data/Seed/DatabaseSeeder.cs` |
| Endpoints | `src/api/CleanArchReference.Api/Endpoints/` |
| Domain Models | `src/api/CleanArchReference.Domain/` |
| Tests | `src/api/CleanArchReference.Tests/` |
| Frontend Entry | `src/web/src/main.tsx` |
| Docker Compose | `docker-compose.yml` |

---

## Architecture Diagram

```mermaid
graph TD
    subgraph "Docker Compose"
        Nginx[Nginx :80] --> API[.NET API :8080]
        Nginx --> FE[React SPA]
        API --> PG[(PostgreSQL :5432)]
        API --> Redis[(Redis :6379)]
        API --> Meili[(Meilisearch :7700)]
    end

    subgraph "Clean Architecture"
        direction LR
        Endpoints[Endpoints<br/>Minimal API] --> AppServices
        AppServices --> MediatR
        MediatR --> Handlers
        Handlers --> Repos[Repository Interfaces]
        Repos --> EF[EF Core / Npgsql]
    end
```

---

## Solution Structure (9 projects)

```
CleanArchReference.slnx
├── CleanArchReference.Api                              → Endpoints (Minimal API), Middleware, Program.cs
├── CleanArchReference.Application                      → ViewModels, AppServices, AutoMapper
├── CleanArchReference.Domain                           → Commands, Handlers, Models, Validators, Domain Services
├── CleanArchReference.Infrastructure.Data              → EF Core, Repositories, Migrations, Seed
├── CleanArchReference.Infrastructure.CrossCutting.IoC  → DI Bootstrapper
├── CleanArchReference.Infrastructure.Services          → Export (CSV/PDF)
├── CleanArchReference.Shared                           → ResponseData envelope
├── CleanArchReference.Tests                            → Unit tests (xUnit)
└── CleanArchReference.IntegrationTests                 → Integration tests
```

---

## Conventions

- **Naming**: PascalCase for classes/methods, camelCase for JSON/DTOs
- **Endpoints**: `MapGroup("/api/recursos")`, extension methods in `Endpoints/`, inject `IXxxAppService`
- **Commands**: inherit `Command<TResult>`, placed in `Domain/{Feature}/Commands/`
- **Handlers**: implement `IRequestHandler<TCommand, TResult>`, placed in `Domain/{Feature}/CommandHandlers/`
- **Validators**: inherit `AbstractValidator<TCommand>`, placed in `Domain/{Feature}/Validations/`
- **AppServices**: inject `IMediatrService` + `IMapper`, never inject infrastructure
- **Events**: `INotification` records in `Domain/{Feature}/Events/`

---
created: 2026-06
updated: 2026-06
tags: architecture, clean-architecture, c4
scope: sh
---

# Architecture

> Clean Architecture with MediatR CQRS, EF Core, and PostgreSQL.

---

## C4 Context Diagram

```mermaid
C4Context
    title System Context — Painel de Obrigações Acessórias

    Person(user, "Accounting User", "Manages fiscal obligations for multiple companies")
    System(system, "Painel Obrigações", "Centralizes accessory obligation tracking")

    Rel(user, system, "Views dashboard, manages companies, tracks obligations")
    Rel(system, user, "Sends alerts about upcoming/overdue deadlines")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

## C4 Container Diagram

```mermaid
C4Container
    title Container Diagram

    Person(user, "User", "Accounting professional")

    Container_Boundary(web, "Frontend") {
        Container(spa, "React SPA", "React 19, Vite, Ant Design", "Provides UI for managing obligations")
    }

    Container_Boundary(api, "Backend") {
        Container(api_dotnet, "REST API", ".NET 9, ASP.NET Core", "Business logic via Clean Architecture")
        Container(redis, "Redis", "Redis 7", "Cache for dashboard and alerts")
        Container(meili, "Meilisearch", "Meilisearch 1.9", "Full-text company search")
    }

    Container_Boundary(db, "Database") {
        ContainerDb(pg, "PostgreSQL", "PostgreSQL 16", "Stores companies and obligations")
    }

    Rel(user, spa, "Uses", "HTTPS/3000")
    Rel(spa, api_dotnet, "API calls", "HTTP/8080")
    Rel(api_dotnet, pg, "Reads/Writes", "EF Core/Npgsql")
    Rel(api_dotnet, redis, "Caches dashboard", "StackExchange.Redis")
    Rel(api_dotnet, meili, "Indexes/search", "Meilisearch .NET")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

---

## Clean Architecture Layers

```mermaid
graph TD
    subgraph "Api"
        Endpoints[Endpoints<br/>Minimal API]
        Middleware[ExceptionMiddleware]
        Program[Program.cs]
    end

    subgraph "Application"
        AppServices[AppServices]
        ViewModels[ViewModels]
        Profiles[AutoMapper Profiles]
    end

    subgraph "Domain"
        Commands[Commands]
        Handlers[CommandHandlers]
        Models[Domain Models]
        Validators[FluentValidation]
        RepoInterfaces[Repository Interfaces]
        Services[Domain Services]
        Events[Domain Events]
    end

    subgraph "Infrastructure.Data"
        DbContext[EF Core DbContext]
        Repositories[Repository Implementations]
        Migrations[Migrations]
        Seed[DatabaseSeeder]
    end

    subgraph "IoC"
        Bootstrapper[ProjectBootstrapper]
        Setups[Feature Setups]
    end

    subgraph "Shared"
        Response[ResponseData]
    end

    Endpoints --> AppServices
    AppServices --> Profiles
    AppServices --> Commands
    Handlers --> RepoInterfaces
    Handlers --> Commands
    Validators --> Commands
    Repositories --> DbContext
    Bootstrapper --> Setups

    Api --> Application
    Api --> IoC
    Api --> Shared
    Application --> Domain
    IoC --> Infrastructure.Data
    IoC --> Application
    IoC --> Domain
    Infrastructure.Data --> Domain

    style Domain fill:#d4e6f1,stroke:#2c3e50
    style Application fill:#d5f5e3,stroke:#1e8449
    style Infrastructure.Data fill:#fdebd0,stroke:#935116
    style Api fill:#e8daef,stroke:#6c3483
    style IoC fill:#fadbd8,stroke:#922b21
    style Shared fill:#f9e79f,stroke:#7d6608
```

---

## Request Flow

```mermaid
sequenceDiagram
    participant Client as HTTP Client
    participant C as Endpoint
    participant AS as AppService
    participant M as IMediatrService
    participant VB as ValidationBehavior
    participant H as CommandHandler
    participant R as Repository
    participant UoW as IUnitOfWork
    participant DB as PostgreSQL

    Client->>C: HTTP Request
    C->>AS: Call AppService Method
    AS->>M: SendCommand(Command)
    M->>VB: Send Command
    VB->>VB: Validate Command
    alt Validation Fails
        VB-->>M: Throw ValidationException
        M-->>AS: Exception propagates
        AS-->>C: Exception propagates
        C-->>Client: 400 Bad Request (ResponseData)
    end
    VB->>H: Handle Command
    H->>R: Query/Persist
    R->>DB: EF Core Query
    DB-->>R: Results
    alt Write Operation
        H->>UoW: CompleteAsync()
        UoW->>DB: SaveChanges
    end
    R-->>H: Domain Model
    H-->>M: Result
    M-->>AS: Result
    AS-->>C: ViewModel
    C-->>Client: 200 OK (ResponseData wrapped)
```

---

## Project Dependencies

```mermaid
graph TD
    Api[CleanArchReference.Api] --> Application[CleanArchReference.Application]
    Api --> IoC[CleanArchReference.Infrastructure.CrossCutting.IoC]
    Api --> Shared[CleanArchReference.Shared]

    Application --> Domain[CleanArchReference.Domain]
    Application --> Shared

    IoC --> Domain
    IoC --> Application
    IoC --> Infrastructure.Data

    Infrastructure.Data --> Domain

    Domain --> Shared

    style Domain fill:#d4e6f1,stroke:#2c3e50,stroke-width:3px
```

The **Domain** project has zero references to any other project in the solution — it's the innermost layer.

---

## Feature Organization

Each business feature follows the same folder structure across all layers:

```
Domain/{Feature}/
├── Commands/           → CreateXCommand, DeleteXCommand : Command<TResult> (writes)
├── Queries/            → FindXQuery, GetXQuery : Query<TResult> (reads)
├── CommandHandlers/    → CreateXCommandHandler, DeleteXCommandHandler
├── QueryHandlers/      → FindXQueryHandler, GetXQueryHandler
├── Models/             → XModel (domain), XReadModel (queries)
├── Repositories/       → IXRepository (interface only)
├── Services/           → IXService (domain logic interfaces)
├── Validations/        → CreateXCommandValidation, FindXQueryValidation
└── Events/             → XCreatedEvent, XDeletedEvent (INotification)

Application/{Feature}/
├── ViewModels/         → CreateXViewModel, XResultViewModel
├── Services/           → IXAppService (interface + implementation)
└── AutoMapper/         → XProfile

Infrastructure.Data/{Feature}/
└── Repositories/       → XRepository (EF Core implementation)
```

---

## Key Patterns

### ResponseData Envelope

All API responses follow the same envelope:

```json
{
  "success": true,
  "message": "",
  "data": { ... },
  "errorCode": null
}
```

| ErrorCode | HTTP Status |
|---|---|
| `null` | 200 OK |
| `Validation` | 400 Bad Request |
| `NotFound` | 404 Not Found |
| `Conflict` | 409 Conflict |
| `InternalError` | 500 Internal Server Error |

### Validation Pipeline

FluentValidation validators are registered per Command and executed automatically by `ValidationBehavior<TRequest, TResponse>` — a MediatR `IPipelineBehavior`.

### Domain Events

Side effects (search indexing, cache invalidation) are handled via MediatR `INotification`:

```
CommandHandler → CompleteAsync → Publish(Event) → NotificationHandler → Index/Invalidate
```

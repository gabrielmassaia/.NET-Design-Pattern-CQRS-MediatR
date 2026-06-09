---
created: 2026-06
updated: 2026-06
tags: backend, conventions, patterns
scope: be
---

# Backend Rules

> .NET coding standards and architectural patterns for the API.

---

## Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Classes | PascalCase, sealed when possible | `CreateEmpresaCommandHandler` |
| Interfaces | Prefix `I` | `IEmpresaRepository` |
| Methods | PascalCase | `Handle`, `FindAllAsync` |
| Parameters | camelCase | `command`, `cancellationToken` |
| Properties | PascalCase | `RazaoSocial` |
| Private fields | `_camelCase` | `_repository` |
| Namespaces | `PainelObrigacoes.{Layer}.{Feature}` | `PainelObrigacoes.Domain.Empresas.Commands` |
| Files | One class per file | `CreateEmpresaCommand.cs` |

---

## Layer Organization

### Domain Layer

Each feature is a folder with:

```
{Domain}/{Feature}/
├── Commands/           → CreateXCommand : Command<TResult>
├── CommandHandlers/    → CreateXCommandHandler : IRequestHandler<>
├── Models/             → XModel : ModelBase (entity), XReadModel (queries)
├── Repositories/       → IXRepository (interface only)
├── Services/           → IXService (domain logic)
├── Validations/        → CreateXCommandValidation : AbstractValidator<>
└── Events/             → XCreatedEvent : INotification
```

Rules:
- **MUST NOT** reference Application, Infrastructure, or HTTP
- **MUST** keep Commands/Handlers/Validators together per feature
- **MUST** use `Command<TResult>` base class for all Commands
- **MUST** implement `IRequestHandler<TCommand, TResult>` for all Handlers

### Application Layer

```
{Application}/{Feature}/
├── ViewModels/         → CreateXViewModel, XResultViewModel
├── Services/           → IXAppService (interface + implementation)
└── AutoMapper/         → XProfile : Profile
```

Rules:
- **MUST** only reference Domain and Shared
- **MUST NOT** reference Infrastructure.Data
- **MUST** keep AppServices thin (ViewModel → Command → Send → Model → ViewModel)
- **MUST** inject `IMediatrService` and `IMapper` only
- **MUST NOT** inject infrastructure services

### Infrastructure.Data Layer

```
{Infrastructure.Data}/{Feature}/
└── Repositories/       → XRepository : IXRepository
```

Rules:
- **MUST** implement interfaces defined in Domain
- **MUST** map between Entity and Domain Model internally
- **MUST NOT** call `SaveChanges` — that is `UnitOfWork`'s job
- **MUST** use `AsNoTracking()` for read-only queries

### IoC Layer

```
{IoC}/{Feature}/
└── XSetup.cs           → static class with AddXFeature extension
```

Rules:
- **MUST** register per feature
- **MUST** call `AddXFeature()` from `ProjectBootstrapper`
- **MUST** register AppServices, Repositories, Domain Services

---

## MediatR Command Pattern

```csharp
// Command (Domain)
public sealed class CreateXCommand : Command<XModel>
{
    public string Property { get; set; }
    public XModel ToModel() => new() { Property = Property };
}

// Handler (Domain)
public sealed class CreateXCommandHandler : IRequestHandler<CreateXCommand, XModel>
{
    private readonly IUnitOfWork _uow;
    private readonly IXRepository _repo;

    public async Task<XModel> Handle(CreateXCommand cmd, CancellationToken ct)
    {
        var model = cmd.ToModel();
        _repo.Create(model);
        await _uow.CompleteAsync(ct);
        return model;
    }
}

// Validator (Domain)
public sealed class CreateXCommandValidation : AbstractValidator<CreateXCommand>
{
    public CreateXCommandValidation()
    {
        RuleFor(c => c.Property).NotEmpty();
    }
}
```

---

## AppService Pattern

```csharp
public sealed class XAppService : IXAppService
{
    private readonly IMediatrService _mediator;
    private readonly IMapper _mapper;

    public XAppService(IMediatrService mediator, IMapper mapper)
    {
        _mediator = mediator;
        _mapper = mapper;
    }

    public async Task<XResultViewModel> CreateAsync(CreateXViewModel vm, CancellationToken ct)
    {
        var command = _mapper.Map<CreateXCommand>(vm);
        var model = await _mediator.SendCommand(command, ct);
        return _mapper.Map<XResultViewModel>(model);
    }
}
```

---

## Repository Pattern

```csharp
// Domain interface
public interface IXRepository
{
    Task<XModel?> FindByIdAsync(Guid id);
    void Create(XModel model);
}

// Infrastructure implementation
public sealed class XRepository : IXRepository
{
    private readonly AppDbContext _context;

    public async Task<XModel?> FindByIdAsync(Guid id)
    {
        var entity = await _context.Set<XEntity>().AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id);
        return entity is null ? null : ToModel(entity);
    }

    public void Create(XModel model)
        => _context.Set<XEntity>().Add(ToEntity(model));

    private static XModel ToModel(XEntity e) => new() { ... };
    private static XEntity ToEntity(XModel m) => new() { ... };
}
```

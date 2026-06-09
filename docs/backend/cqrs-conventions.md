---
created: 2026-06
updated: 2026-06
tags: backend, cqrs, conventions, naming
scope: be
---

# CQRS Naming Conventions

> When to use Command vs Query naming in the MediatR CQRS pattern.

---

## Golden Rule

| Scenario | Base Class | Folder | Handler Folder | Example |
|---|---|---|---|---|
| **Write** (create, update, delete) | `Command<TResult>` | `Commands/` | `CommandHandlers/` | `CreateEmpresaCommand` |
| **Read** (find, get, search, list) | `Query<TResult>` | `Queries/` | `QueryHandlers/` | `FindEmpresasQuery` |

---

## Command (Write Operations)

Use a **Command** when the operation **changes state**:

- `CreateEmpresaCommand` — creates a new entity
- `DeleteEmpresaCommand` — removes an entity
- `RegistrarEntregaCommand` — updates delivery status
- `UpdateObrigacaoCommand` — modifies an entity

```csharp
public sealed class CreateEmpresaCommand : Command<EmpresaModel> { }
```

## Query (Read Operations)

Use a **Query** when the operation **returns data without side effects**:

- `FindEmpresasQuery` — lists entities with pagination
- `GetDashboardQuery` — returns dashboard data
- `SearchEmpresasQuery` — full-text search
- `GetHistoricoEmpresaQuery` — returns historical data
- `FindObrigacoesQuery` — filtered list with params

```csharp
public sealed class FindEmpresasQuery : Query<IList<EmpresaModel>> { }
```

---

## Validation Naming

Validators must match the type they validate:

| Class Being Validated | Validator Name | File Name |
|---|---|---|
| `CreateEmpresaCommand` | `CreateEmpresaCommandValidation` | `CreateEmpresaCommandValidation.cs` |
| `FindEmpresasQuery` | `FindEmpresasQueryValidation` | `FindEmpresasQueryValidation.cs` |
| `RegistrarEntregaCommand` | `RegistrarEntregaCommandValidation` | `RegistrarEntregaCommandValidation.cs` |

**Rules:**
- **MUST NOT** use "Command" in a validator name that validates a Query
- **MUST NOT** use "Query" in a validator name that validates a Command
- File name **MUST** match the class name

---

## Handler Naming

| Message Type | Handler Name | Folder |
|---|---|---|
| `CreateEmpresaCommand` | `CreateEmpresaCommandHandler` | `CommandHandlers/` |
| `FindEmpresasQuery` | `FindEmpresasQueryHandler` | `QueryHandlers/` |

---

## Common Mistakes

| ❌ Wrong | ✅ Correct | Why |
|---|---|---|
| `FindEmpresasCommand` | `FindEmpresasQuery` | "Find" is a read, not a write |
| `GetDashboardCommand` | `GetDashboardQuery` | "Get" is a read, not a write |
| `FindEmpresasCommandHandler` | `FindEmpresasQueryHandler` | Handler must match message type |
| `SearchEmpresasCommandValidation.cs` | `SearchEmpresasQueryValidation.cs` | File name must match the validated type |

---

## Check List

When adding a new feature, ask:

1. Does this change state? → **Command**
2. Does this only return data? → **Query**
3. Does the validator name match the class it validates?
4. Is the file name identical to the class name?
5. Is the handler in the correct folder (`CommandHandlers/` vs `QueryHandlers/`)?

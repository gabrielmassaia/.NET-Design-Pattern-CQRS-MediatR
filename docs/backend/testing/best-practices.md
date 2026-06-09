---
created: 2026-06
updated: 2026-06
tags: testing, backend, best-practices
scope: be
---

# Backend Testing — Best Practices

---

## What to Test

### Command Handlers

Test every handler with:
1. **Happy path** — Valid input, verify persistence + commit
2. **Not found** — Entity missing, verify exception + no commit
3. **Conflict** — Duplicate or business rule violation

### Validators

Test every FluentValidation validator with:
1. Valid input → no errors
2. Empty/missing required fields
3. Invalid formats (CNPJ, email)
4. Boundary values (max length, date ranges)

### AppServices

Test that AppService:
1. Maps ViewModel → Command correctly
2. Sends Command via `IMediatorService`
3. Maps result back to ViewModel

### Domain Services

Test complex logic like:
1. TributaryRulesEngine: regime × month × obligations matrix
2. DueDateCalculator: each obligation type's due date rule
3. BusinessDayAdjuster: Saturday/Sunday → next business day

---

## What NOT to Test

- **EF Core queries** — tested via integration tests, not unit tests
- **AutoMapper configuration** — verify at integration level
- **Controller routing** — tested via functional tests if needed
- **IoC registration** — tested via application startup

---

## Naming Convention

```
{ClassUnderTest}_{Scenario}_{ExpectedResult}
```

Examples:
- `Handle_ShouldPersistAndCommit`
- `Handle_WhenCnpjDuplicado_ShouldThrowInvalidOperation`
- `Handle_WhenNotFound_ShouldThrowKeyNotFoundException`
- `SimplesNacional_Janeiro_DeveTerObrigacoesCorretas`

---

## Mocking Guidelines

- Use `Mock<T>` for all dependencies
- Verify interactions with `Times.Once`, `Times.Never`
- Use `It.IsAny<T>()` for parameters you don't need to assert
- Use `It.Is<T>(x => x.Property == value)` for specific parameter matching

---

## Test File Organization

One test file per handler/service class:

```
Tests/Domain/{Feature}/{Xxx}CommandHandlerTests.cs
Tests/Application/{Feature}{Xxx}AppServiceTests.cs
```

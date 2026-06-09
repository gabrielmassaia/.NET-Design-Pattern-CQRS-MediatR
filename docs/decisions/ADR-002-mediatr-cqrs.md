---
status: Accepted
date: 2026-06
tags: architecture, cqrs, mediatr
---

# ADR-002: Use MediatR for CQRS with FluentValidation Pipeline

## Context

The application needs a consistent way to handle use cases (commands) and queries with automatic validation before execution.

## Decision

Use MediatR library to implement CQRS pattern:

- **Commands** inherit `Command<TResult>` and implement `IRequest<TResult>`
- **Handlers** implement `IRequestHandler<TCommand, TResult>`
- **ValidationBehavior** (IPipelineBehavior) auto-executes FluentValidation validators before handlers
- **IMediatrService** wraps `IMediator` for AppServices to depend on

## Consequences

**Positive:**
- Commands are explicit and type-safe
- Validation runs automatically for all commands
- Handlers are isolated and testable
- New features = new Command + Handler + Validator files

**Negative:**
- More files per feature (Command, Handler, Validator, Event)
- Pipeline behaviors add a small overhead

## Compliance

See: `docs/backend/rules.md`, `docs/architecture.md`

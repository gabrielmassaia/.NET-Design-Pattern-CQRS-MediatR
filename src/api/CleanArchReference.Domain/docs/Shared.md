# Shared (Domínio)

## Responsabilidade

Contém as abstrações e comportamentos compartilhados entre todas as features do domínio.

## Estrutura

```
Shared/
├── Commands/
│   └── Command.cs            # Base class para commands de escrita
├── Queries/
│   └── Query.cs              # Base class para queries de leitura
├── Behaviors/
│   └── ValidationBehavior.cs # Pipeline do MediatR para validação
├── Interfaces/
│   ├── IMediatrService.cs    # Abstração do MediatR para AppServices
│   └── IUnitOfWork.cs        # Contrato de unidade de trabalho
└── Models/
    └── ModelBase.cs          # Base class para modelos de domínio
```

## Abstrações

### Command\<TResult\> e Query\<TResult\>

Separação CQRS: commands representam intenções de escrita (alteram estado), queries representam intenções de leitura (apenas consultam).

```csharp
public abstract class Command<TResult> : IRequest<TResult> { }
public abstract class Query<TResult> : IRequest<TResult> { }
```

Ambos implementam `IRequest<TResult>` do MediatR, permitindo que o pipeline `ValidationBehavior` processe ambos.

### ValidationBehavior

Pipeline do MediatR que executa automaticamente todos os `IValidator<TRequest>` registrados para o request antes do handler ser chamado.

```csharp
public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
{
    var failures = validators.Select(v => v.ValidateAsync(context))
                             .SelectMany(r => r.Errors)
                             .ToList();

    if (failures.Count != 0)
        throw new ValidationException(failures);

    return await next();
}
```

Se a validação falhar, lança `ValidationException` que é capturada pelo `ExceptionMiddleware` (HTTP 400).

### IMediatrService

Ponte entre a camada Application e o MediatR. AppServices injetam esta interface em vez do `IMediator` diretamente, mantendo o acoplamento baixo.

```csharp
public interface IMediatrService
{
    Task<TResult> SendCommand<TResult>(Command<TResult> command, CancellationToken ct = default);
    Task<TResult> SendQuery<TResult>(Query<TResult> query, CancellationToken ct = default);
}
```

### IUnitOfWork

Centraliza o `SaveChanges` do EF Core. Repositórios nunca chamam `SaveChanges` diretamente — apenas os handlers de escrita chamam `CompleteAsync()`.

## Conexões

- **Infrastructure.CrossCutting.IoC** → implementa `IMediatrService` e `IUnitOfWork`
- **Todos os Commands/Queries** → herdam de `Command<T>` ou `Query<T>`
- **Todos os Handlers** → usam `IUnitOfWork.CompleteAsync()` em operações de escrita
- **ExceptionMiddleware** → captura `ValidationException` lançada pelo `ValidationBehavior`

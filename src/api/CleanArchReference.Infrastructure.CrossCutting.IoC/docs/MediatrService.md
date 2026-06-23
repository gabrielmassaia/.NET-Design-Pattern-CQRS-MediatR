# MediatrService

## Responsabilidade

Implementa a interface `IMediatrService`, servindo como ponte entre a camada Application e o MediatR.

## Funcionamento

```csharp
public Task<TResult> SendCommand<TResult>(Command<TResult> command, CancellationToken ct)
    => _mediator.Send(command, ct);

public Task<TResult> SendQuery<TResult>(Query<TResult> query, CancellationToken ct)
    => _mediator.Send(query, ct);
```

Ambos delegam para `IMediator.Send()` do MediatR, que executa o pipeline:
1. `ValidationBehavior` (FluentValidation)
2. `CommandHandler` / `QueryHandler`

## Por que uma camada extra?

AppServices injetam `IMediatrService` em vez de `IMediator` diretamente por dois motivos:

1. **Desacoplamento**: se a implementação do MediatR mudar, só este arquivo é alterado
2. **Segregação**: `SendCommand` e `SendQuery` são métodos separados, diferente do `IMediator.Send()` único — isso reforça a separação CQRS no código do AppService

## Conexões

- **Domain/Shared/Interfaces/IMediatrService** → contrato implementado aqui
- **Application/Dashboard, Empresas, Obrigacoes** → AppServices usam esta interface
- **ProjectBootstrapper** → registra como `Scoped`

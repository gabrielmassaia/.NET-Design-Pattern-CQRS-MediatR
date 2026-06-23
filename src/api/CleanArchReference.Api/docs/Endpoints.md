# Endpoints (Minimal API)

## Responsabilidade

Camada de entrada HTTP da aplicação. Recebe requisições REST, extrai parâmetros, chama AppServices e retorna respostas padronizadas.

## Estrutura

```
Endpoints/
├── EmpresasEndpoints.cs
├── ObrigacoesEndpoints.cs
└── DashboardEndpoints.cs
```

Cada arquivo contém um grupo de endpoints organizado por feature. Usa-se Minimal API com handlers extraídos em métodos privados estáticos — o `MapGroup` contém apenas roteamento e metadata, e cada handler é um método separado.

## Padrão

```csharp
group.MapGet("/", NomeDoHandler)
    .WithName("NomeDoHandler")
    .Produces<ResponseData<T>>(StatusCodes.Status200OK);

private static async Task<IResult> NomeDoHandler(
    int skip = 0,
    IService service,
    CancellationToken ct)
{
    var result = await service.MethodAsync(skip, ct);
    return result.ToOkResponse();
}
```

## Conexões

- **AppServices** → cada endpoint injeta o AppService da feature e delega a execução
- **ResultExtensions** → o retorno `result.ToOkResponse()` encapsula em `ResponseData<T>`
- **ExceptionMiddleware** → erros não tratados (validação, não encontrado, conflito) são capturados pelo middleware global
- **Rate Limiting** → endpoints de export usam `.RequireRateLimiting("Export")` com limite de 5 req/min

## Regras

- Handlers nunca contêm lógica de negócio — só orquestram chamadas ao AppService
- Validações de domínio são feitas via FluentValidation no ValidationBehavior
- Parâmetros de query opcionais têm defaults explícitos (ex: `int take = 50`)

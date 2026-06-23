# Extensions

## Responsabilidade

Fornece métodos de extensão para converter respostas dos AppServices em `IResult` no formato padronizado do projeto.

## Arquivo

```
Extensions/ResultExtensions.cs
```

## Métodos

### `ToOkResponse<T>(this T data)`

Converte qualquer objeto em `Results.Ok(ResponseData<T>.Ok(data))`.

Uso principal: endpoints de sucesso retornam o DTO puro do AppService e este método encapsula no envelope `ResponseData<T>`.

```csharp
var result = await appService.FindAllAsync(skip, take, ct);
return result.ToOkResponse();
// Gera: { "success": true, "data": [...], "errorCode": null }
```

### `ToMinimalApiResult<T>(this ResponseData<T> response)`

Converte um `ResponseData<T>` já montado em `IResult` com status code adequado baseado no `ErrorCode`.

Uso secundário: para cenários onde o `ResponseData<T>` já foi construído manualmente (ex: em migração de controllers legados).

```csharp
return response switch
{
    { Success: true } => Results.Ok(response),
    { ErrorCode: NotFound } => Results.NotFound(response),
    { ErrorCode: Conflict } => Results.Conflict(response),
    _ => Results.BadRequest(response)
};
```

## Conexões

- **Endpoints** → os handlers chamam `.ToOkResponse()` no retorno do AppService
- **ExceptionMiddleware** → o middleware retorna `ResponseData<object>.Fail()` diretamente no body, sem passar por estas extensões

---
created: 2026-06
updated: 2026-06
tags: backend, controllers, api
scope: be
---

# Controllers (Histórico)

> **Nota:** A camada HTTP atual usa **Minimal APIs** (`Api/Endpoints/`).
> Este documento descreve o padrão anterior baseado em Controllers, mantido como referência.
> Consulte [endpoints.md](endpoints.md) para a documentação ativa.

---

## Structure

All controllers follow the same structure:

```csharp
[Route("api/recursos")]
public sealed class RecursosController : BaseController
{
    private readonly IRecursoAppService _appService;

    public RecursosController(IRecursoAppService appService) => _appService = appService;

    [HttpGet]
    public async Task<IActionResult> FindAll(CancellationToken ct)
        => Ok(await _appService.FindAllAsync(ct));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateRecursoViewModel payload, CancellationToken ct)
        => Ok(await _appService.CreateAsync(payload, ct));

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        => Ok(await _appService.DeleteAsync(id, ct));
}
```

---

## Rules

1. **MUST** inherit from `BaseController` (which has `[ApiController]`)
2. **MUST** inject only `IXxxAppService` — never repositories, never MediatR directly
3. **MUST NOT** have try/catch blocks — handled by global `ExceptionMiddleware`
4. **MUST NOT** have manual `if` validation — handled by FluentValidation pipeline
5. **MUST** return `Ok(await _service.MethodAsync())` for success cases
6. **MUST** use `[Route("api/recursos")]` — plural resource names
7. **MUST** accept `CancellationToken ct` parameter in async actions

---

## Available Controllers

| Controller | Route | Endpoints |
|---|---|---|
| `EmpresasController` | `api/empresas` | `GET /`, `POST /`, `DELETE /{id}`, `GET /search?q=` |
| `ObrigacoesController` | `api/obrigacoes` | `GET /`, `PATCH /{id}/entrega` |
| `DashboardController` | `api/dashboard` | `GET /`, `GET /alertas` |

---

## Global Middleware

| Middleware | Purpose |
|---|---|
| `ExceptionMiddleware` | Catches `ValidationException`→400, `InvalidOperationException`→409, `KeyNotFoundException`→404 |
| `ResultExtensions.ToOkResponse()` | Wraps data in `ResponseData<T>.Ok()` per endpoint |

---

## Response Wrapping

In the new Minimal API pattern, each endpoint wraps its response using `ResultExtensions.ToOkResponse<T>()`:

```csharp
// Endpoint returns raw DTO
var result = await appService.FindAllAsync(skip, take, ct);
return result.ToOkResponse();

// ToOkResponse wraps it:
// { "success": true, "data": [...], "errorCode": null }
```

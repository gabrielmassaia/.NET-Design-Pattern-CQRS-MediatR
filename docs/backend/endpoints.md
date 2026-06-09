---
created: 2026-06
updated: 2026-06
tags: backend, endpoints, api
scope: be
---

# Endpoints (Minimal API)

> Pattern and conventions for the API endpoints.

---

## Structure

All endpoints follow the same structure. Each feature has its own file under `Api/Endpoints/`:

```
Api/Endpoints/
├── EmpresasEndpoints.cs
├── ObrigacoesEndpoints.cs
└── DashboardEndpoints.cs
```

Each file exposes a static extension method:

```csharp
public static IEndpointRouteBuilder MapEmpresasEndpoints(this IEndpointRouteBuilder app)
```

Registered in `Program.cs`:

```csharp
app.MapEmpresasEndpoints();
app.MapObrigacoesEndpoints();
app.MapDashboardEndpoints();
```

---

## Available Endpoints

| Endpoint Group | Route | Endpoints |
|---|---|---|
| `EmpresasEndpoints` | `api/empresas` | `GET /`, `POST /`, `DELETE /{id}`, `GET /search?q=` |
| `ObrigacoesEndpoints` | `api/obrigacoes` | `GET /`, `PATCH /{id}/entrega`, `GET /historico/{empresaId}`, `GET /export` |
| `DashboardEndpoints` | `api/dashboard` | `GET /`, `GET /alertas`, `GET /alertas/export`, `GET /export` |

---

## Pattern

```csharp
public static class EmpresasEndpoints
{
    public static IEndpointRouteBuilder MapEmpresasEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/empresas").WithTags("Empresas");

        group.MapGet("/", async (int skip = 0, int take = 50,
                IEmpresaAppService appService, CancellationToken ct) =>
            {
                var result = await appService.FindAllAsync(skip, take, ct);
                return result.ToOkResponse();
            })
            .WithName("FindAllEmpresas")
            .Produces<ResponseData<IList<EmpresaResultViewModel>>>(StatusCodes.Status200OK);

        return app;
    }
}
```

---

## Rules

1. **MUST** use `ResultExtensions.ToOkResponse<T>()` for success responses
2. **MUST NOT** add try/catch — use ExceptionMiddleware
3. **MUST NOT** add `if` validation logic — use FluentValidation via ValidationBehavior
4. **MUST** set parameter defaults for optional query params (`int take = 50`)
5. **MUST** add Swagger metadata (`.Produces<T>()`, `.WithName()`, `.WithTags()`)
6. **SHOULD** group related endpoints under `MapGroup` with `WithTags`
7. **SHOULD** use `RequireRateLimiting()` for rate-limited endpoints

---

## Rate Limiting

Policies are applied per group or per endpoint:

```csharp
group.MapGet("/export", ...)
    .RequireRateLimiting("Export");
```

Available policies: `ApiGlobal` (100 req/min), `Export` (5 req/min).

---

## Response Wrapping

All responses are wrapped in `ResponseData<T>` via `ResultExtensions.ToOkResponse<T>()`:

```csharp
// Endpoint returns raw DTO
return result.ToOkResponse();
// → Results.Ok(ResponseData<T>.Ok(result))
```

Errors are handled by `ExceptionMiddleware` which returns `ResponseData<object>.Fail()`.

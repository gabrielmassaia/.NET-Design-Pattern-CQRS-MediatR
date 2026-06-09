# Security Considerations

> This document details the security implementations and trade-offs in the Painel de Obrigações Acessórias project.

---

## Implemented Protections

### Rate Limiting

Implemented with .NET 9 native `System.Threading.RateLimiting`:

| Policy | Limit | Scope |
|--------|-------|-------|
| `ApiGlobal` | 100 req/min per IP | All routes |
| `Export` | 5 req/min per IP | CSV/PDF export endpoints |

Returns HTTP 429 when exceeded.

### Security Headers (Backend)

`SecurityHeadersMiddleware.cs` adds 7 headers to API responses:

| Header | Value |
|--------|-------|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `0` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cross-Origin-Resource-Policy` | `same-origin` |

### Nginx Security

- HTTPS with self-signed certificate (generated at build via `openssl`)
- HSTS: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- Automatic HTTP → HTTPS redirect
- Additional security headers at proxy level

### DDoS Protection (Three Layers)

| Layer | Configuration |
|-------|--------------|
| **Nginx** | `client_max_body_size 1M`, `limit_conn addr 10`, `limit_req zone=api rate=30r/s burst=20`, timeouts |
| **Kestrel** | `MaxRequestBodySize 1MB`, `MaxConcurrentConnections 100`, `KeepAliveTimeout 2min`, `RequestHeadersTimeout 30s` |
| **Docker** | Per-container CPU/memory resource limits |
| **Validation** | `[Range(1, 500)]` on `take` parameters to prevent oversized queries |

### CORS

Restricted to known origins:

```csharp
.WithOrigins("http://localhost:5173", "http://localhost:3000")
```

### Cache Invalidation via Events

`EmpresaCreatedHandler` and `EmpresaDeletedHandler` invalidate dashboard cache (`dashboard:{year}:{month}`) via `IDistributedCache.RemoveAsync()` on domain events.

### CSV Injection Protection

`BuildCsvRow` prefixes cells starting with `=`, `+`, `-`, `@` with `\t` — preventing formula execution in Excel.

### Information Disclosure

`ExceptionMiddleware` uses `IWebHostEnvironment` — production returns generic messages and logs details server-side only.

### Meilisearch Index Configuration

`MeilisearchIndexSetup` (`IHostedService`) configures the index on startup:
- `searchableAttributes`: `["razaoSocial", "cnpj"]`
- `filterableAttributes`: `["regime"]`

---

## Intentionally Omitted

### Authentication and Authorization (JWT)

**Not implemented.** The case does not require login, user registration, or role differentiation. This is an architecture demonstration system.

**If this were production:** Add `Microsoft.AspNetCore.Authentication.JwtBearer` with `RequireAuthorization()` on endpoints and refresh token support.

### CSRF Protection

**Not implemented.** CSRF exploits require session cookies — since there is no authentication, there are no session cookies, making the attack surface negligible.

**If this were production:** Add `AddAntiforgery()` with `X-CSRF-TOKEN` header and configure Axios to send it on mutations.

### Secrets Management (.env / User Secrets)

**Not used.** Connection strings (PostgreSQL, Redis, Meilisearch) are embedded in `docker-compose.yml` with default values for immediate execution via Docker. Acceptable for a local demonstration.

**In production:**
- Use **User Secrets** (`dotnet user-secrets`) in development
- Use **Azure Key Vault / AWS Secrets Manager** in production
- Read via environment variables in `docker-compose.yml`

### Multi-Tenant / User Isolation

**Not implemented.** The system does not distinguish between companies of different users because there is no user concept — a single dashboard for demonstration.

**In production:** Add `tenantId` to entities and filter all queries by the authenticated user's tenant.

### HTTPS for Internal Services

Communication between Docker containers (API → Redis, API → DB, API → Meilisearch) is plain text. In Docker development, this is standard. In production, configure TLS for inter-service communication or use isolated Docker networks.

---

## Evolution Roadmap

- [ ] JWT authentication with refresh token + `[Authorize]`
- [ ] CSRF protection (`AddAntiforgery`)
- [ ] ProblemDetails (RFC 7807) instead of custom envelope
- [ ] Secrets in User Secrets / Key Vault
- [ ] Serilog with `UseSerilogRequestLogging()` and distributed correlation
- [ ] Integration tests for concurrency (simultaneous PATCH)
- [ ] Complete OpenAPI documentation with request/response examples

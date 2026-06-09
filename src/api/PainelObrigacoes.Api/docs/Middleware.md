# Middleware

## Responsabilidade

Pipeline de tratamento global de requisições HTTP. Executa antes e depois dos endpoints, aplicando segurança, tratamento de erros e headers.

## Arquivos

```
Middleware/
├── ExceptionMiddleware.cs
└── SecurityHeadersMiddleware.cs
```

---

## ExceptionMiddleware

Captura exceções não tratadas e retorna respostas JSON padronizadas no formato `ResponseData<object>.Fail()` com status code adequado.

| Exceção | Status | ErrorCode |
|---|---|---|
| `ValidationException` (FluentValidation) | 400 Bad Request | `Validation` |
| `InvalidOperationException` | 409 Conflict | `Conflict` |
| `KeyNotFoundException` | 404 Not Found | `NotFound` |
| `Exception` (não tratada) | 500 Internal Server Error | `InternalError` |

Em ambiente de produção, as mensagens de erro são genéricas para evitar vazamento de informação. Em desenvolvimento, a mensagem original é exibida.

```csharp
// Exemplo de resposta de erro:
{
  "success": false,
  "message": "CNPJ já cadastrado.",
  "data": null,
  "errorCode": "Conflict"
}
```

### Conexões

- **FluentValidation** → `ValidationException` lançada pelo `ValidationBehavior` é capturada aqui
- **Domain Handlers** → `InvalidOperationException` e `KeyNotFoundException` lançadas nos handlers são capturadas aqui

---

## SecurityHeadersMiddleware

Adiciona headers de segurança em todas as respostas da API:

| Header | Valor |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `0` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cross-Origin-Resource-Policy` | `same-origin` |

### Conexões

- **Nginx** → headers redundantes também são aplicados no proxy reverso (camada dupla de segurança)
- **CORS** → configurado via `AddCors` no `Program.cs`, restrito a origens locais

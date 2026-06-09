---
created: 2026-06
updated: 2026-06
tags: backend, api, response, contract
scope: be
---

# Response Data Envelope

> Standard API response contract.

---

## Format

All API responses follow the same envelope structure:

```json
{
  "success": true,
  "message": "",
  "data": { ... },
  "errorCode": null
}
```

---

## Error Codes

| ErrorCode | HTTP Status | When |
|---|---|---|
| `null` | 200 OK | Successful operation |
| `Validation` | 400 Bad Request | FluentValidation failure or invalid input |
| `NotFound` | 404 Not Found | Entity not found (KeyNotFoundException) |
| `Conflict` | 409 Conflict | Duplicate or business rule violation (InvalidOperationException) |
| `InternalError` | 500 Internal Server Error | Unhandled exception |

---

## Success Response

```json
{
  "success": true,
  "message": "",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "cnpj": "11222333000181",
    "razaoSocial": "Padaria São João Ltda",
    "regime": 1
  },
  "errorCode": null
}
```

## Validation Error Response

```json
{
  "success": false,
  "message": "CNPJ é obrigatório; Razão Social é obrigatória",
  "data": null,
  "errorCode": "Validation"
}
```

## Conflict Response

```json
{
  "success": false,
  "message": "CNPJ já cadastrado.",
  "data": null,
  "errorCode": "Conflict"
}
```

## Not Found Response

```json
{
  "success": false,
  "message": "Empresa não encontrada.",
  "data": null,
  "errorCode": "NotFound"
}
```

## Error Response

```json
{
  "success": false,
  "message": "Ocorreu um erro interno.",
  "data": null,
  "errorCode": "InternalError"
}
```

---

## Implementation

```csharp
public class ResponseData<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public ResponseErrorCode? ErrorCode { get; set; }

    public static ResponseData<T> Ok(T data, string message = "")
        => new() { Success = true, Message = message, Data = data };

    public static ResponseData<T> Fail(string message, ResponseErrorCode errorCode = ResponseErrorCode.Unknown)
        => new() { Success = false, Message = message, ErrorCode = errorCode };
}
```

---

## How It Works

1. **Endpoints** return raw data wrapped via `ResultExtensions.ToOkResponse()`: `return result.ToOkResponse()`
2. **`ExceptionMiddleware`** catches exceptions and returns `ResponseData<T>.Fail()` with appropriate error code and status

> **Note:** Only 2xx responses are wrapped. Error/failure responses are handled by the `ExceptionMiddleware` directly.

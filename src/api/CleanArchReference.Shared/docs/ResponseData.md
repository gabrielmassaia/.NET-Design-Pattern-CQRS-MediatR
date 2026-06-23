# ResponseData

## Responsabilidade

Define o envelope de resposta padronizado para todas as respostas da API.

## Arquivos

```
ResponseData/
├── ResponseData.cs          # Envelope genérico
└── ResponseErrorCode.cs     # Códigos de erro
```

### ResponseData\<T\>

Todas as respostas da API seguem este formato:

```json
{
  "success": true,
  "message": "",
  "data": { ... },
  "errorCode": null
}
```

| Propriedade | Tipo | Descrição |
|---|---|---|
| `Success` | `bool` | Indica se a operação foi bem-sucedida |
| `Message` | `string` | Mensagem descritiva (opcional, usada em erros) |
| `Data` | `T?` | Dados da resposta |
| `ErrorCode` | `ResponseErrorCode?` | Código do erro (nulo em sucesso) |

Métodos estáticos:

```csharp
ResponseData<T>.Ok(data)           // Cria resposta de sucesso
ResponseData<T>.Fail(message, code) // Cria resposta de erro
```

### ResponseErrorCode

```csharp
public enum ResponseErrorCode
{
    Unknown = 0,
    Validation = 1,
    NotFound = 3,
    Conflict = 4,
    InternalError = 6
}
```

Mapeamento para HTTP:

| ErrorCode | HTTP Status |
|---|---|
| `null` | 200 OK |
| `Validation` | 400 Bad Request |
| `NotFound` | 404 Not Found |
| `Conflict` | 409 Conflict |
| `InternalError` | 500 Internal Server Error |

## Conexões

- **Api/Extensions/ResultExtensions** → `ToOkResponse<T>()` encapsula dados no envelope
- **Api/Middleware/ExceptionMiddleware** → retorna `ResponseData<object>.Fail()` em erros
- **Application/ViewModels** → os dados tipados são carregados em `Data`
- **Frontend** → o client espera este formato para todas as respostas

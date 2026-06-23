# CleanArchReference.Api — Ponto de Entrada da Aplicação

## ① Degrau na escada (topo)

```
 ────────────────────────────────────
 ① Api  ← VOCÊ ESTÁ AQUI  → recebe HTTP, injeta AppServices
 ② Application               → orquestra o fluxo
 ③ IoC                        → monta as dependências
 ④ Domain                    → executa a lógica de negócio
 ⑤ Data                      → persiste os dados
 ⑥ Services                  → gera relatórios
 ─────────────────────
 ⑦ Shared                    → envelope de resposta
```

## Responsabilidade

É a porta de entrada da aplicação — expõe os endpoints REST que o frontend consome.
Recebe requisições HTTP, delega para as camadas internas e retorna respostas padronizadas.

## O que contém

| Pasta/Arquivo | Função |
|---|---|
| `Endpoints/` | Endpoints REST por feature (EmpresasEndpoints, ObrigacoesEndpoints, DashboardEndpoints) |
| `Extensions/` | Extensões para resposta padronizada (ResultExtensions) |
| `Middleware/` | Handlers globais e filtros |
| `Program.cs` | Bootstrap da aplicação |
| `appsettings.json` | Configurações (connection strings, Meilisearch, Redis) |

### Endpoints (Minimal API)

Cada endpoint é **fino** — só recebe parâmetros, chama AppService e retorna resultado:

- `EmpresasEndpoints` → CRUD + busca (GET, POST, DELETE, GET /search)
- `ObrigacoesEndpoints` → calendário, entrega, histórico, exportação
- `DashboardEndpoints` → KPIs, alertas, exportação

### Middleware

- `ExceptionMiddleware` — captura exceções não tratadas e retorna ResponseData com status HTTP correto
- `SecurityHeadersMiddleware` — adiciona headers de segurança

### ResultExtensions

- `ToOkResponse<T>()` — encapsula retornos em `ResponseData<T>.Ok()` e converte para `IResult`
- `ToMinimalApiResult<T>()` — converte `ResponseData<T>` existente para `IResult` com status code adequado

## Dependências

- CleanArchReference.Application
- CleanArchReference.Infrastructure.CrossCutting.IoC
- CleanArchReference.Shared

## Fluxo completo da requisição

```
HTTP Request
  → Endpoint (valida parâmetros)
    → AppService (mapeia ViewModel → Command/Query)
      → IMediatrService (encaminha para MediatR)
        → ValidationBehavior (valida)
          → CommandHandler/QueryHandler (executa lógica)
            → Repository (consulta/persiste)
              → IUnitOfWork.CompleteAsync (commit, se escrita)
    ← Resultado volta pela mesma cadeia
  ← ResultExtensions.ToOkResponse encapsula em ResponseData<T>
← HTTP Response (JSON)
```

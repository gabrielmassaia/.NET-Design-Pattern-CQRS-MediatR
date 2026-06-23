# Painel de Obrigações Acessórias — API

## Visão Rápida dos Módulos

```
 HTTP Request
      │
      ▼
 ┌──────────────────────────────────────────────────────────────────┐
 │ ① Api                Ponto de entrada. Endpoints (Minimal API),   │
 │                        Program.cs. Só recebe HTTP e delegua.     │
 ├──────────────────────────────────────────────────────────────────┤
 │ ② Application        Fachada fina. AppServices, ViewModels,      │
 │                        AutoMapper. Orquestra o fluxo.            │
 ├──────────────────────────────────────────────────────────────────┤
 │ ③ CrossCutting.IoC   Composition Root. MediatrService,           │
 │                        ProjectBootstrapper. Monta o DI.          │
 ├──────────────────────────────────────────────────────────────────┤
 │ ④ Domain             Núcleo do negócio. Commands, Queries,       │
 │                        Handlers, Models, Validators, Eventos.    │
 │                        Zero dependências externas.               │
 ├──────────────────────────────────────────────────────────────────┤
 │ ⑤ Infrastructure.Data Persistência. EF Core DbContext,           │
 │                        Repositories, Migrations, Meilisearch.    │
 ├──────────────────────────────────────────────────────────────────┤
 │ ⑥ Infrastructure.Services  Exportação. PDF (QuestPDF) e CSV.     │
 ├──────────────────────────────────────────────────────────────────┤
 │ ⑦ Shared             Fundação. ResponseData envelope, tipos      │
 │                        compartilhados. Todos os módulos usam.    │
 └──────────────────────────────────────────────────────────────────┘
      │
      ▼
 PostgreSQL / Redis / Meilisearch
```

| Módulo | Pasta | Depende de |
|---|---|---|
| ① Api | `CleanArchReference.Api` | Application, IoC, Shared |
| ② Application | `CleanArchReference.Application` | Domain, Shared |
| ③ IoC | `CleanArchReference.Infrastructure.CrossCutting.IoC` | Domain, Application, Data, Services |
| ④ Domain | `CleanArchReference.Domain` | Shared (só) |
| ⑤ Data | `CleanArchReference.Infrastructure.Data` | Domain |
| ⑥ Services | `CleanArchReference.Infrastructure.Services` | Application |
| ⑦ Shared | `CleanArchReference.Shared` | **nenhum** |

## Fluxo de uma requisição

```
Endpoint → AppService → IMediatrService → ValidationBehavior → Handler → Repository → IUnitOfWork → PostgreSQL
```

Para mais detalhes, leia o `README.md` dentro de cada módulo.

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
| ① Api | `PainelObrigacoes.Api` | Application, IoC, Shared |
| ② Application | `PainelObrigacoes.Application` | Domain, Shared |
| ③ IoC | `PainelObrigacoes.Infrastructure.CrossCutting.IoC` | Domain, Application, Data, Services |
| ④ Domain | `PainelObrigacoes.Domain` | Shared (só) |
| ⑤ Data | `PainelObrigacoes.Infrastructure.Data` | Domain |
| ⑥ Services | `PainelObrigacoes.Infrastructure.Services` | Application |
| ⑦ Shared | `PainelObrigacoes.Shared` | **nenhum** |

## Fluxo de uma requisição

```
Endpoint → AppService → IMediatrService → ValidationBehavior → Handler → Repository → IUnitOfWork → PostgreSQL
```

Para mais detalhes, leia o `README.md` dentro de cada módulo.

# PainelObrigacoes.Domain — Núcleo do Negócio

## ④ Degrau na escada

```
 ① Api
 ② Application
 ③ IoC → envia Command/Query para ↓
 ────────────────────────────────────
 ④ Domain  ← VOCÊ ESTÁ AQUI
 ⑤ Data (implementa contratos)
 ⑥ Services
 ─────────────────────
 ⑦ Shared
```

## Responsabilidade

Contém **toda a lógica de negócio** e as regras fiscais da aplicação.
É o centro da arquitetura limpa — não conhece Application, nem HTTP, nem banco.

## O que contém

| Pasta | Função |
|---|---|
| `Commands/` | Intenções de **escrita** (Create, Delete, RegistrarEntrega) |
| `CommandHandlers/` | Executores dos commands (usam IUnitOfWork) |
| `Queries/` | Intenções de **leitura** (Find, Get, Search) |
| `QueryHandlers/` | Executores das queries (só leitura, sem side effects) |
| `Models/` | Modelos de domínio (regras de negócio) |
| `Repositories/` | **Interfaces** dos repositórios (contratos puros) |
| `Services/` | Serviços de domínio: cálculo de vencimentos, regras tributárias, feriados |
| `Validations/` | FluentValidation validators para Commands e Queries |
| `Events/` | Eventos de domínio (INotification) para side effects |
| `Enums/` | Enums compartilhados (RegimeTributario, StatusObrigacao, TipoObrigacao) |
| `Shared/` | Base classes (Command, Query), ValidationBehavior, IMediatrService, IUnitOfWork |

## Dependências

- PainelObrigacoes.Shared
- Pacotes NuGet: MediatR, FluentValidation

## Quem depende

- PainelObrigacoes.Application (usa Commands, Queries, Models)
- PainelObrigacoes.Infrastructure.Data (implementa interfaces de repositório)
- PainelObrigacoes.Infrastructure.CrossCutting.IoC (registra handlers)

## Regras importantes

- **Não pode** referenciar Application, Infrastructure ou HTTP
- Commands sempre alteram estado (usam IUnitOfWork)
- Queries só leem dados (nunca chamam CompleteAsync)
- Handlers disparam eventos INotification para side effects (cache, search index)

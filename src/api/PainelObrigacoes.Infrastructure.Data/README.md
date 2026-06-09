# PainelObrigacoes.Infrastructure.Data — Persistência

## ⑤ Degrau na escada

```
 ① Api
 ② Application
 ③ IoC
 ④ Domain                    → define contratos (interfaces)
 ────────────────────────────────────
 ⑤ Infrastructure.Data  ← VOCÊ ESTÁ AQUI  → implementa contratos + persiste
 ⑥ Services
 ─────────────────────
 ⑦ Shared
```

## Responsabilidade

Implementa os contratos definidos no Domain e gerencia a persistência dos dados.
Contém toda a infraestrutura de banco de dados, ORM, migrações e busca.

## O que contém

| Pasta/Arquivo | Função |
|---|---|
| `Context/AppDbContext.cs` | DbContext do EF Core (PostgreSQL) |
| `Context/UnitOfWork.cs` | Implementação do IUnitOfWork (centraliza SaveChanges) |
| `Entities/` | Mapeamento ORM das entidades (EntityBase, EmpresaEntity, ObrigacaoEntity) |
| `Configurations/` | Fluent API mappings (EmpresaConfiguration, ObrigacaoConfiguration) |
| `{Feature}/Repositories/` | Implementações concretas dos repositórios |
| `Migrations/` | Migrations do EF Core (criadas via CLI) |
| `Seed/DatabaseSeeder.cs` | Semeador de dados demo para desenvolvimento |
| `Search/` | Indexação e busca no Meilisearch |
| `Events/` | Handlers de eventos de domínio (cache invalidation, search indexing) |

## Dependências

- PainelObrigacoes.Domain
- Pacotes NuGet: EF Core, Npgsql, Meilisearch .NET Client

## Quem depende

- PainelObrigacoes.Infrastructure.CrossCutting.IoC (registra os repositórios)

## Regras importantes

- **Nunca chama SaveChanges diretamente** — quem chama é o IUnitOfWork
- Repositórios só operam em memória e delegam o commit para o UnitOfWork
- Usa `AsNoTracking()` para consultas de leitura
- Mapeia entre Entity (ORM) e Model (Domínio) internamente
- Handlers de eventos ficam aqui porque precisam de acesso a serviços infra (Redis, Meilisearch)

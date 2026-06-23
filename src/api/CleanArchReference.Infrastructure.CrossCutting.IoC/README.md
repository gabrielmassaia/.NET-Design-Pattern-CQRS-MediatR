# CleanArchReference.Infrastructure.CrossCutting.IoC — Composição de Dependências

## ③ Degrau na escada

```
 ① Api
 ② Application               → injeta AppServices + IMediatrService
 ────────────────────────────────────
 ③ CrossCutting.IoC  ← VOCÊ ESTÁ AQUI  → monta tudo (DI composition root)
 ④ Domain                    → registra handlers, validators, contracts
 ⑤ Data                      → registra repositórios, DbContext
 ⑥ Services                  → registra serviços de export
 ─────────────────────
 ⑦ Shared
```

## Responsabilidade

É a **raiz de composição** (Composition Root) da aplicação.
Conecta todas as camadas registrando as dependências no container DI do ASP.NET Core.

## O que contém

| Arquivo/Pasta | Função |
|---|---|
| `ProjectBootstrapper.cs` | Ponto central — chama todos os setups na ordem correta |
| `MediatrService.cs` | Implementação do `IMediatrService` (ponte para MediatR) |
| `{Feature}/XSetup.cs` | Registro por feature (AddEmpresaFeature, AddObrigacaoFeature, AddDashboardFeature) |

## Fluxo de chamada

```
AppService chama IMediatrService.SendCommand(Command)
  → MediatrService (aqui) encaminha para IMediator.Send
    → ValidationBehavior valida o Command
      → CommandHandler executa a lógica
```

## Dependências

- CleanArchReference.Domain
- CleanArchReference.Application
- CleanArchReference.Infrastructure.Data
- CleanArchReference.Infrastructure.Services
- Pacotes NuGet: MediatR, FluentValidation, AutoMapper, EF Core, Meilisearch, Redis

## Quem depende

- CleanArchReference.Api (chama `services.RegisterServices(configuration)` no Program.cs)

## Regras importantes

- Único lugar onde as dependências são resolvidas
- Cada feature tem seu próprio Setup (organização por responsabilidade)
- MediatrService é a ponte que AppServices usam para enviar Commands/Queries

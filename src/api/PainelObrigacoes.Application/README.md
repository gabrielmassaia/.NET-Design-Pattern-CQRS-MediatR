# PainelObrigacoes.Application — Fachada da Aplicação

## ② Degrau na escada

```
 ① Api (Endpoints)         → injeta AppService
 ────────────────────────────────────
 ② Application  ← VOCÊ ESTÁ AQUI  → envia Command/Query via IMediatrService
 ③ IoC
 ④ Domain
 ⑤ Data
 ⑥ Services
 ─────────────────────
 ⑦ Shared
```

## Responsabilidade

Funciona como uma **fachada fina** entre os endpoints e o domínio.
Orquestra o fluxo: recebe ViewModel do endpoint → mapeia para Command/Query → envia via IMediatrService → retorna ViewModel.

## O que contém

| Pasta | Função |
|---|---|
| `{Feature}/ViewModels/` | DTOs de entrada/saída (ex: CreateEmpresaViewModel, EmpresaResultViewModel) |
| `{Feature}/Services/` | AppServices — classes que coordenam o fluxo (ex: EmpresaAppService) |
| `{Feature}/AutoMapper/` | Profiles de mapeamento ViewModel ↔ Command/Query ↔ Model |

## Dependências

- PainelObrigacoes.Domain
- PainelObrigacoes.Shared
- Pacotes NuGet: AutoMapper

## Quem depende

- PainelObrigacoes.Api (endpoints injetam AppServices)
- PainelObrigacoes.Infrastructure.Services (export usa ViewModels)
- PainelObrigacoes.Infrastructure.CrossCutting.IoC (registra AppServices)

## Regras importantes

- AppServices **não contêm lógica de negócio** — só orquestração
- Injetam apenas `IMediatrService` e `IMapper`
- Usam `SendCommand` para escritas e `SendQuery` para leituras
- Não podem referenciar Infrastructure.Data diretamente

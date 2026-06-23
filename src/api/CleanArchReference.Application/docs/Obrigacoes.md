# Obrigações

## Responsabilidade

Gerencia o calendário de obrigações fiscais, registro de entregas, histórico e exportação.

## Estrutura

```
Obrigacoes/
├── Services/
│   ├── IObrigacaoAppService.cs      # Contrato
│   ├── ObrigacaoAppService.cs       # Implementação
│   └── IObrigacaoExportService.cs   # Exportação PDF/CSV
├── ViewModels/
│   ├── FindObrigacoesViewModel.cs   # Filtros de busca
│   ├── ObrigacaoResultViewModel.cs  # DTO de saída
│   └── RegistrarEntregaViewModel.cs # DTO de entrada (entrega)
└── AutoMapper/
    └── ObrigacaoProfile.cs          # Mapeamentos
```

## Fluxo

### Listagem com filtros

```
Endpoint → ObrigacaoAppService.FindAsync(filter)
  → mapper: FindObrigacoesViewModel → FindObrigacoesQuery
  → IMediatrService.SendQuery(query)
    → FindObrigacoesQueryHandler
      → IObrigacaoRepository.FindByEmpresaAndMonthAsync()
      → calcula status (Pendente/Atrasada/Entregue) com base na data atual
  → mapper: IList<ObrigacaoReadModel> → IList<ObrigacaoResultViewModel>
```

### Registro de entrega

```
Endpoint → ObrigacaoAppService.RegistrarEntregaAsync(id, payload)
  → cria RegistrarEntregaCommand
  → IMediatrService.SendCommand(command)
    → RegistrarEntregaCommandHandler
      → valida se obrigação existe e não está entregue
      → atualiza DataEntrega e Status
      → IUnitOfWork.CompleteAsync()
      → publica ObrigacaoEntregueEvent (→ invalida cache)
  → mapper: ObrigacaoModel → ObrigacaoResultViewModel
```

### Histórico

```
Endpoint → ObrigacaoAppService.GetHistoricoAsync(empresaId)
  → IMediatrService.SendQuery(GetHistoricoEmpresaQuery)
    → GetHistoricoEmpresaQueryHandler
      → IObrigacaoRepository.FindEntreguesByEmpresaAsync()
```

### Exportação

```
Endpoint → ObrigacaoAppService.ExportAsync(filter, formato)
  → busca dados via FindAsync()
  → gera PDF (QuestPDF) ou CSV conforme formato
```

## Conexões

- **Domain/Obrigacoes** → Commands, Queries, Handlers, Models, Repository interface
- **Infrastructure.Services** → implementação concreta de `IObrigacaoExportService`
- **Redis** → cache invalidado via `ObrigacaoEntregueEvent`

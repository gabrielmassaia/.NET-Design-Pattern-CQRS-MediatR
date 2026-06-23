# Dashboard

## Responsabilidade

Fornece os dados consolidados para a tela inicial do sistema: KPIs, gráficos e alertas de vencimento.

## Estrutura

```
Dashboard/
├── Services/
│   ├── IDashboardAppService.cs        # Contrato
│   ├── DashboardAppService.cs         # Implementação base
│   ├── CachedDashboardAppService.cs   # Decorator com cache Redis
│   └── IDashboardExportService.cs     # Exportação PDF/CSV
├── ViewModels/
│   ├── DashboardResultViewModel.cs    # KPIs da tela inicial
│   └── AlertaResultViewModel.cs       # Alerta individual
└── AutoMapper/
    └── DashboardProfile.cs            # Mapeamento Model → ViewModel
```

## Fluxo

```
Endpoint → IDashboardAppService → IMediatrService → DashboardQueryHandler → IObrigacaoRepository
```

O `CachedDashboardAppService` decor a implementação base:
- Cache hit → retorna dados do Redis sem chamar o handler
- Cache miss → chama o handler, cacheia o resultado com TTL (30s dashboard, 60s alertas)
- Invalidação via eventos de domínio (empresa criada/deletada, obrigação entregue)

## Conexões

- **Domain/Dashboard** → Commands e Handlers que executam as queries
- **Infrastructure.Data/Obrigacoes.Repositories** → repositório que busca os dados agregados
- **Redis** → cache distribuído via `IDistributedCache`

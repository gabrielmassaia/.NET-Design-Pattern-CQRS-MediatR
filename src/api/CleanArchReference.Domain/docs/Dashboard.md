# Dashboard (Domínio)

## Responsabilidade

Contém as queries e modelos para a tela de dashboard: KPIs consolidados e alertas de vencimento.

## Estrutura

```
Dashboard/
├── Queries/
│   ├── GetDashboardQuery.cs      # Intenção de buscar KPIs
│   └── GetAlertasQuery.cs        # Intenção de buscar alertas
├── QueryHandlers/
│   ├── GetDashboardQueryHandler.cs
│   └── GetAlertasQueryHandler.cs
└── Models/
    ├── DashboardModel.cs          # KPIs do mês atual
    └── AlertaModel.cs             # Alerta de obrigação próxima/atrasada
```

## Queries

### GetDashboardQuery

Sem parâmetros. Retorna os KPIs consolidados do mês/ano atual:

- Total de empresas cadastradas
- Total de obrigações do mês
- Quantidade de entregues, pendentes e atrasadas

### GetAlertasQuery

Sem parâmetros. Retorna obrigações com vencimento nos próximos 30 dias (incluindo já atrasadas), ordenadas por urgência (data de vencimento crescente). Limite de 50 registros.

## Conexões

- **Application/Dashboard** → AppServices que enviam as queries
- **Domain/Obrigacoes/Repositories** → os handlers usam `IObrigacaoRepository` para buscar os dados agregados

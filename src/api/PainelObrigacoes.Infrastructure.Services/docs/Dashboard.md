# Dashboard (Export Service)

## Responsabilidade

Gera relatórios de exportação do dashboard e alertas nos formatos PDF e CSV.

## Arquivo

```
Dashboard/DashboardExportService.cs
```

Implementa `IDashboardExportService` com os métodos:

- `ToPdfDashboard(dashboard, alertas)` → relatório completo em PDF
- `ToCsvDashboard(dashboard, alertas)` → relatório completo em CSV
- `ToPdfAlertas(alertas)` → apenas alertas em PDF
- `ToCsvAlertas(alertas)` → apenas alertas em CSV

### Proteção contra CSV Injection

Células que começam com `=`, `+`, `-`, `@` são prefixadas com `\t` para prevenir execução de fórmulas maliciosas no Excel.

## Conexões

- **Application/Dashboard/Services/IDashboardExportService** → contrato implementado aqui
- **Application/Dashboard/ViewModels** → dados de entrada para gerar os relatórios
- **Infrastructure.CrossCutting.IoC/Dashboard** → registra o serviço no DI

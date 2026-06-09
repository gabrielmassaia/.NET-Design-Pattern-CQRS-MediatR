# Obrigações (IoC Setup)

## Responsabilidade

Registra as dependências da feature Obrigações no container DI.

## Arquivo

```
Obrigacoes/ObrigacaoSetup.cs
```

## Registros

```csharp
services.AddScoped<IObrigacaoAppService, ObrigacaoAppService>();
services.AddScoped<IObrigacaoRepository, ObrigacaoRepository>();
services.AddScoped<IObrigacaoExportService, ObrigacaoExportService>();

services.AddSingleton<IHolidayProvider, BrazilianHolidayProvider>();
services.AddSingleton<IBusinessDayAdjuster, BusinessDayAdjuster>();
services.AddSingleton<IDueDateCalculator, DueDateCalculator>();
services.AddSingleton<ITributaryRulesEngine, TributaryRulesEngine>();

services.AddScoped<INotificationHandler<ObrigacaoEntregueEvent>, ObrigacaoEntregueHandler>();
```

Note que os serviços de domínio (TributaryRulesEngine, etc.) são registrados como **Singleton** porque não têm estado e podem ser reutilizados entre requisições.

## Conexões

- **Application/Obrigacoes** → AppService
- **Infrastructure.Data/Obrigacoes.Repositories** → repositório concreto
- **Infrastructure.Services/Obrigacoes** → export service concreto
- **Domain/Obrigacoes/Services** → serviços de domínio (TributaryRulesEngine, DueDateCalculator, etc.)
- **Infrastructure.Data/Events** → event handlers
- **ProjectBootstrapper** → chama `AddObrigacaoFeature()`

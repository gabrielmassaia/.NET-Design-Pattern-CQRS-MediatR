# Dashboard (IoC Setup)

## Responsabilidade

Registra as dependências da feature Dashboard no container DI.

## Arquivo

```
Dashboard/DashboardSetup.cs
```

## Registros

```csharp
services.AddScoped<IDashboardExportService, DashboardExportService>();
services.AddScoped<DashboardAppService>();
services.AddScoped<IDashboardAppService>(sp =>
    new CachedDashboardAppService(
        sp.GetRequiredService<DashboardAppService>(),
        sp.GetRequiredService<IDistributedCache>()));
```

Note que `DashboardAppService` é registrado sem interface, e `IDashboardAppService` aponta para o `CachedDashboardAppService` (decorator pattern). Isso garante que:

- Quem injeta `IDashboardAppService` recebe o wrapper com cache
- O `DashboardAppService` real é registrado para ser injetado dentro do `CachedDashboardAppService`

## Conexões

- **Application/Dashboard/Services** → AppServices e interface
- **Infrastructure.Services/Dashboard** → export service concreto
- **ProjectBootstrapper** → chama `AddDashboardFeature()`

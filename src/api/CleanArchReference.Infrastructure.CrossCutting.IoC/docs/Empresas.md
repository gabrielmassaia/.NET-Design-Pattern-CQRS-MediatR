# Empresas (IoC Setup)

## Responsabilidade

Registra as dependências da feature Empresas no container DI.

## Arquivo

```
Empresas/EmpresaSetup.cs
```

## Registros

```csharp
services.AddScoped<IEmpresaAppService, EmpresaAppService>();
services.AddScoped<IEmpresaRepository, EmpresaRepository>();
services.AddScoped<IEmpresaSearchService, MeilisearchEmpresaService>();

services.AddScoped<INotificationHandler<EmpresaCreatedEvent>, EmpresaCreatedHandler>();
services.AddScoped<INotificationHandler<EmpresaDeletedEvent>, EmpresaDeletedHandler>();
```

## Conexões

- **Application/Empresas** → AppService
- **Infrastructure.Data/Empresas.Repositories** → repositório concreto
- **Infrastructure.Data/Search** → Meilisearch service
- **Infrastructure.Data/Events** → event handlers
- **ProjectBootstrapper** → chama `AddEmpresaFeature()`

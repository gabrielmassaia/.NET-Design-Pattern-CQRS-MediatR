# ProjectBootstrapper

## Responsabilidade

Ponto central de registro de dependências (Composition Root). Configura todos os serviços da aplicação no container DI do ASP.NET Core.

## O que registra

```csharp
public static IServiceCollection RegisterServices(this IServiceCollection services, IConfiguration configuration)
{
    // Infraestrutura
    services.AddDbContext<AppDbContext>(...);              // PostgreSQL via Npgsql
    services.AddStackExchangeRedisCache(...);              // Redis para cache
    services.AddSingleton(new MeilisearchClient(...));     // Meilisearch
    services.AddHostedService<MeilisearchIndexSetup>();    // Setup do índice

    // Cross-cutting
    services.AddScoped<IUnitOfWork, UnitOfWork>();
    services.AddScoped<IMediatrService, MediatrService>();

    // MediatR + FluentValidation
    services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(domainAssembly, infraAssembly));
    services.AddValidatorsFromAssembly(domainAssembly);

    // AutoMapper
    services.AddAutoMapper(typeof(EmpresaProfile).Assembly);

    // Feature setups (cada feature registra seus próprios serviços)
    services
        .AddEmpresaFeature()
        .AddObrigacaoFeature()
        .AddDashboardFeature();

    return services;
}
```

## Conexões

- **Program.cs** → chama `builder.Services.RegisterServices(builder.Configuration)`
- **Feature Setups** (`AddEmpresaFeature`, etc.) → registram AppServices, Repositories, Domain Services
- **MediatrService** → implementação da ponte entre AppServices e MediatR

// ============================================================
// 🟢 Composition Root — ONDE TUDO É CONECTADO
// ============================================================
//
// Responsabilidade: "Registrar TODAS as dependências do sistema no DI"
// O que faz:       Configura EF Core, Redis, Meilisearch, MediatR, etc.
//
// Composition Root = o ÚNICO lugar onde as dependências são resolvidas
//   1. Program.cs chama services.RegisterServices(configuration)
//   2. Aqui registra TUDO que o DI precisa saber
//   3. O ASP.NET resolve as dependências automaticamente quando precisa
//
// REGRA DE OURO:
//   NENHUMA classe faz "new" de outra classe complexa
//   TUDO é resolvido pelo DI via construtor
// ============================================================

using FluentValidation;
using MediatR;
using Meilisearch;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PainelObrigacoes.Domain.Shared.Behaviors;
using PainelObrigacoes.Domain.Shared.Interfaces;
using PainelObrigacoes.Infrastructure.CrossCutting.IoC.Dashboard;
using PainelObrigacoes.Infrastructure.CrossCutting.IoC.Empresas;
using PainelObrigacoes.Infrastructure.CrossCutting.IoC.Obrigacoes;
using PainelObrigacoes.Infrastructure.CrossCutting.IoC.Tags;
using PainelObrigacoes.Infrastructure.Data.Context;
using PainelObrigacoes.Infrastructure.Data.Services;

namespace PainelObrigacoes.Infrastructure.CrossCutting.IoC;

public static class ProjectBootstrapper
{
    // 🟢 RegisterServices: chamado pelo Program.cs
    //
    // services = o container de DI do ASP.NET
    // configuration = arquivos appsettings.json + environment variables
    public static IServiceCollection RegisterServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // ============================================================
        // 🟠 INFRAESTRUTURA: BANCO DE DADOS (PostgreSQL + EF Core)
        // ============================================================
        // Configura o DbContext do EF Core pra usar PostgreSQL
        // ConnectionString vem do appsettings.json
        // SplitQuery = evita cartesian explosion em consultas com JOIN
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                npgsql => npgsql.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)));

        // ============================================================
        // 🟠 INFRAESTRUTURA: REDIS (Cache Distribuído)
        // ============================================================
        // Usado pra cachear dashboard e alertas
        // IDistributedCache é a interface padrão do .NET
        // AddStackExchangeRedisCache implementa usando Redis
        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = configuration.GetConnectionString("Redis");
            options.InstanceName = "painel:"; // prefixo das chaves no Redis
        });

        // ============================================================
        // 🟠 INFRAESTRUTURA: MEILISEARCH (Busca Full-Text)
        // ============================================================
        // Cliente HTTP pra API do Meilisearch
        // Singleton = uma instância pra toda a aplicação
        var meiliUrl = configuration["Meilisearch:Url"]
            ?? throw new InvalidOperationException("Meilisearch:Url é obrigatória.");
        var meiliKey = configuration["Meilisearch:MasterKey"]
            ?? throw new InvalidOperationException("Meilisearch:MasterKey é obrigatória.");
        services.AddSingleton(new MeilisearchClient(meiliUrl, meiliKey));

        // Hosted Services = serviços que rodam em BACKGROUND
        services.AddHostedService<PainelObrigacoes.Infrastructure.Data.Search.MeilisearchIndexSetup>();
        services.AddHostedService<YearRolloverService>();

        // ============================================================
        // 🟡 DOMAIN SERVICES (registrados como singleton/scoped)
        // ============================================================
        services.AddSingleton<IDateTimeProvider, DateTimeProvider>(); // Relógio do sistema (testável)
        services.AddScoped<IUnitOfWork, UnitOfWork>();                // Commit único
        services.AddScoped<IMediatrService, MediatrService>();        // Ponte App → MediatR

        // ============================================================
        // 🟡 MEDIATR — CORAÇÃO DO CQRS
        // ============================================================
        // domainAssembly = assembly do Domain (onde estão os Handlers)
        // infraAssembly  = assembly da Infrastructure.Data (onde estão Event Handlers)
        var domainAssembly = typeof(PainelObrigacoes.Domain.Empresas.CommandHandlers
            .CreateEmpresaCommandHandler).Assembly;
        var infraAssembly = typeof(PainelObrigacoes.Infrastructure.Data.Events
            .EmpresaCreatedHandler).Assembly;

        services.AddMediatR(cfg =>
        {
            // Registra todos os IRequestHandlers e INotificationHandlers dos assemblies
            cfg.RegisterServicesFromAssemblies(domainAssembly, infraAssembly);

            // Adiciona o ValidationBehavior no pipeline do MediatR
            // Roda ANTES de TODO handler (pra todo Command e Query)
            cfg.AddBehavior(
                typeof(IPipelineBehavior<,>),
                typeof(ValidationBehavior<,>));
        });

        // ============================================================
        // 🟡 FLUENTVALIDATION — Validação Automática
        // ============================================================
        // Escaneia o assembly do Domain e registra TODOS os validators
        // Ex: CreateEmpresaCommandValidation vira IValidator<CreateEmpresaCommand>
        services.AddValidatorsFromAssembly(domainAssembly);

        // ============================================================
        // 🟢 AUTOMAPPER — Tradução Automática entre Camadas
        // ============================================================
        // Escaneia o assembly da Application (onde estão os Profiles)
        services.AddAutoMapper(
            typeof(PainelObrigacoes.Application.Empresas.AutoMapper.EmpresaProfile).Assembly);

        // ============================================================
        // 🎯 FEATURE REGISTRATIONS (cada feature registra suas dependências)
        // ============================================================
        services
            .AddEmpresaFeature()   // IEmpresaAppService, IEmpresaRepository, etc.
            .AddObrigacaoFeature() // IObrigacaoAppService, IObrigacaoRepository, etc.
            .AddDashboardFeature() // IDashboardAppService, etc.
            .AddTagFeature();      // ITagAppService, ITagRepository, etc.

        return services;
    }
}

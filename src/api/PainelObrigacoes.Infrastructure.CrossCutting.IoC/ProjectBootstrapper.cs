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
using PainelObrigacoes.Infrastructure.Data.Context;
using PainelObrigacoes.Infrastructure.Data.Services;

namespace PainelObrigacoes.Infrastructure.CrossCutting.IoC;

public static class ProjectBootstrapper
{
    public static IServiceCollection RegisterServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                npgsql => npgsql.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)));

        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = configuration.GetConnectionString("Redis");
            options.InstanceName = "painel:";
        });

        var meiliUrl = configuration["Meilisearch:Url"]
            ?? throw new InvalidOperationException("Meilisearch:Url é obrigatória.");
        var meiliKey = configuration["Meilisearch:MasterKey"]
            ?? throw new InvalidOperationException("Meilisearch:MasterKey é obrigatória.");
        services.AddSingleton(new MeilisearchClient(meiliUrl, meiliKey));

        services.AddHostedService<PainelObrigacoes.Infrastructure.Data.Search.MeilisearchIndexSetup>();
        services.AddHostedService<YearRolloverService>();

        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IMediatrService, MediatrService>();

        var domainAssembly = typeof(PainelObrigacoes.Domain.Empresas.CommandHandlers
            .CreateEmpresaCommandHandler).Assembly;
        var infraAssembly = typeof(PainelObrigacoes.Infrastructure.Data.Events
            .EmpresaCreatedHandler).Assembly;

        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssemblies(domainAssembly, infraAssembly);
            cfg.AddBehavior(
                typeof(IPipelineBehavior<,>),
                typeof(ValidationBehavior<,>));
        });

        services.AddValidatorsFromAssembly(domainAssembly);

        services.AddAutoMapper(
            typeof(PainelObrigacoes.Application.Empresas.AutoMapper.EmpresaProfile).Assembly);

        services
            .AddEmpresaFeature()
            .AddObrigacaoFeature()
            .AddDashboardFeature();

        return services;
    }
}

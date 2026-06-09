using MediatR;
using Microsoft.Extensions.DependencyInjection;
using PainelObrigacoes.Application.Empresas.Services;
using PainelObrigacoes.Domain.Empresas.Repositories;
using PainelObrigacoes.Domain.Empresas.Services;
using PainelObrigacoes.Infrastructure.Data.Empresas.Repositories;
using PainelObrigacoes.Infrastructure.Data.Events;
using PainelObrigacoes.Infrastructure.Data.Search;

namespace PainelObrigacoes.Infrastructure.CrossCutting.IoC.Empresas;

public static class EmpresaSetup
{
    public static IServiceCollection AddEmpresaFeature(this IServiceCollection services)
    {
        services.AddScoped<IEmpresaAppService, EmpresaAppService>();
        services.AddScoped<IEmpresaRepository, EmpresaRepository>();
        services.AddScoped<IEmpresaSearchService, MeilisearchEmpresaService>();

        services.AddScoped<INotificationHandler<Domain.Empresas.Events.EmpresaCreatedEvent>, EmpresaCreatedHandler>();
        services.AddScoped<INotificationHandler<Domain.Empresas.Events.EmpresaDeletedEvent>, EmpresaDeletedHandler>();

        return services;
    }
}

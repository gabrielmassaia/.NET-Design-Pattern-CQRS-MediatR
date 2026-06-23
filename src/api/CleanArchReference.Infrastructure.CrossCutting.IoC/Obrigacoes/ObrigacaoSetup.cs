using MediatR;
using Microsoft.Extensions.DependencyInjection;
using CleanArchReference.Application.Obrigacoes.Services;
using CleanArchReference.Domain.Obrigacoes.Repositories;
using CleanArchReference.Domain.Obrigacoes.Services;
using CleanArchReference.Infrastructure.Data.Events;
using CleanArchReference.Infrastructure.Data.Obrigacoes.Repositories;
using CleanArchReference.Infrastructure.Services.Obrigacoes;

namespace CleanArchReference.Infrastructure.CrossCutting.IoC.Obrigacoes;

public static class ObrigacaoSetup
{
    public static IServiceCollection AddObrigacaoFeature(this IServiceCollection services)
    {
        services.AddScoped<IObrigacaoAppService, ObrigacaoAppService>();
        services.AddScoped<IObrigacaoRepository, ObrigacaoRepository>();
        services.AddScoped<IObrigacaoExportService, ObrigacaoExportService>();

        services.AddSingleton<IHolidayProvider, BrazilianHolidayProvider>();
        services.AddSingleton<IBusinessDayAdjuster, BusinessDayAdjuster>();
        services.AddSingleton<IDueDateCalculator, DueDateCalculator>();
        services.AddSingleton<ITributaryRulesEngine, TributaryRulesEngine>();

        services.AddScoped<INotificationHandler<Domain.Obrigacoes.Events.ObrigacaoEntregueEvent>, ObrigacaoEntregueHandler>();

        return services;
    }
}

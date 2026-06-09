using MediatR;
using Microsoft.Extensions.DependencyInjection;
using PainelObrigacoes.Application.Obrigacoes.Services;
using PainelObrigacoes.Domain.Obrigacoes.Repositories;
using PainelObrigacoes.Domain.Obrigacoes.Services;
using PainelObrigacoes.Infrastructure.Data.Events;
using PainelObrigacoes.Infrastructure.Data.Obrigacoes.Repositories;
using PainelObrigacoes.Infrastructure.Services.Obrigacoes;

namespace PainelObrigacoes.Infrastructure.CrossCutting.IoC.Obrigacoes;

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

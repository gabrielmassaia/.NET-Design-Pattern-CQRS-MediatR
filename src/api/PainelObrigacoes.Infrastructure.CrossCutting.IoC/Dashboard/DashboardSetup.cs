using Microsoft.Extensions.DependencyInjection;
using PainelObrigacoes.Application.Dashboard.Services;
using PainelObrigacoes.Infrastructure.Services.Dashboard;

namespace PainelObrigacoes.Infrastructure.CrossCutting.IoC.Dashboard;

public static class DashboardSetup
{
    public static IServiceCollection AddDashboardFeature(this IServiceCollection services)
    {
        services.AddScoped<IDashboardExportService, DashboardExportService>();
        services.AddScoped<DashboardAppService>();
        services.AddScoped<IDashboardAppService>(sp =>
            new CachedDashboardAppService(
                sp.GetRequiredService<DashboardAppService>(),
                sp.GetRequiredService<Microsoft.Extensions.Caching.Distributed.IDistributedCache>()));
        return services;
    }
}

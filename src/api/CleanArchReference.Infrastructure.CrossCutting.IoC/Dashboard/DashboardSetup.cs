using Microsoft.Extensions.DependencyInjection;
using CleanArchReference.Application.Dashboard.Services;
using CleanArchReference.Infrastructure.Services.Dashboard;

namespace CleanArchReference.Infrastructure.CrossCutting.IoC.Dashboard;

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

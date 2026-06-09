using PainelObrigacoes.Api.Extensions;
using PainelObrigacoes.Application.Dashboard.Services;
using PainelObrigacoes.Application.Dashboard.ViewModels;
using PainelObrigacoes.Shared.ResponseData;

namespace PainelObrigacoes.Api.Endpoints;

public static class DashboardEndpoints
{
    public static IEndpointRouteBuilder MapDashboardEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/dashboard")
            .WithTags("Dashboard");

        group.MapGet("/", GetDashboardAsync)
            .WithName("GetDashboard")
            .Produces<ResponseData<DashboardResultViewModel>>(StatusCodes.Status200OK);

        group.MapGet("/alertas", GetAlertasAsync)
            .WithName("GetAlertas")
            .Produces<ResponseData<IList<AlertaResultViewModel>>>(StatusCodes.Status200OK);

        group.MapGet("/alertas/export", ExportAlertasAsync)
            .WithName("ExportAlertas")
            .RequireRateLimiting("Export");

        group.MapGet("/export", ExportDashboardAsync)
            .WithName("ExportDashboard")
            .RequireRateLimiting("Export");

        return app;
    }

    private static async Task<IResult> GetDashboardAsync(
        int? ano, int? mes,
        IDashboardAppService appService,
        CancellationToken ct)
    {
        var result = await appService.GetDashboardAsync(ano, mes, ct);
        return result.ToOkResponse();
    }

    private static async Task<IResult> GetAlertasAsync(
        IDashboardAppService appService,
        CancellationToken ct)
    {
        var result = await appService.GetAlertasAsync(ct);
        return result.ToOkResponse();
    }

    private static async Task<IResult> ExportAlertasAsync(
        string formato,
        IDashboardAppService appService,
        CancellationToken ct)
    {
        var (content, contentType, fileName) = await appService.ExportAlertasAsync(formato, ct);
        return Results.File(content, contentType, fileName);
    }

    private static async Task<IResult> ExportDashboardAsync(
        string formato,
        IDashboardAppService appService,
        CancellationToken ct)
    {
        var (content, contentType, fileName) = await appService.ExportDashboardAsync(formato, ct);
        return Results.File(content, contentType, fileName);
    }
}

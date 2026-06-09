using AutoMapper;
using PainelObrigacoes.Application.Dashboard.ViewModels;
using PainelObrigacoes.Domain.Dashboard.Queries;
using PainelObrigacoes.Domain.Shared.Interfaces;

namespace PainelObrigacoes.Application.Dashboard.Services;

public sealed class DashboardAppService : IDashboardAppService
{
    private readonly IMediatrService _mediator;
    private readonly IMapper _mapper;
    private readonly IDashboardExportService _exportService;

    public DashboardAppService(IMediatrService mediator, IMapper mapper, IDashboardExportService exportService)
    {
        _mediator = mediator;
        _mapper = mapper;
        _exportService = exportService;
    }

    public async Task<DashboardResultViewModel> GetDashboardAsync(int? ano = null, int? mes = null, CancellationToken ct = default)
    {
        var model = await _mediator.SendQuery(new GetDashboardQuery { Ano = ano, Mes = mes }, ct);
        return _mapper.Map<DashboardResultViewModel>(model);
    }

    public async Task<IList<AlertaResultViewModel>> GetAlertasAsync(CancellationToken ct = default)
    {
        var models = await _mediator.SendQuery(new GetAlertasQuery(), ct);
        return _mapper.Map<IList<AlertaResultViewModel>>(models);
    }

    public async Task<(byte[] Content, string ContentType, string FileName)> ExportAlertasAsync(
        string formato, CancellationToken ct = default)
    {
        var alertas = await GetAlertasAsync(ct);
        var now = DateTime.Now;
        return formato.ToLowerInvariant() switch
        {
            "pdf"  => (_exportService.ToPdfAlertas(alertas), "application/pdf", $"alertas-{now:yyyy-MM}.pdf"),
            "xlsx" => (_exportService.ToXlsxAlertas(alertas), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"alertas-{now:yyyy-MM}.xlsx"),
            _      => (_exportService.ToCsvAlertas(alertas), "text/csv", $"alertas-{now:yyyy-MM}.csv"),
        };
    }

    public async Task<(byte[] Content, string ContentType, string FileName)> ExportDashboardAsync(
        string formato, CancellationToken ct = default)
    {
        var dashboard = await GetDashboardAsync(ct: ct);
        var alertas = await GetAlertasAsync(ct);
        var now = DateTime.Now;
        return formato.ToLowerInvariant() switch
        {
            "pdf"  => (_exportService.ToPdfDashboard(dashboard, alertas), "application/pdf", $"dashboard-{now:yyyy-MM}.pdf"),
            "xlsx" => (_exportService.ToXlsxDashboard(dashboard, alertas), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"dashboard-{now:yyyy-MM}.xlsx"),
            _      => (_exportService.ToCsvDashboard(dashboard, alertas), "text/csv", $"dashboard-{now:yyyy-MM}.csv"),
        };
    }
}

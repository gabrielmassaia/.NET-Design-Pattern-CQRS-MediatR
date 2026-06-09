using PainelObrigacoes.Application.Dashboard.ViewModels;

namespace PainelObrigacoes.Application.Dashboard.Services;

public interface IDashboardAppService
{
    Task<DashboardResultViewModel> GetDashboardAsync(CancellationToken ct = default);
    Task<IList<AlertaResultViewModel>> GetAlertasAsync(CancellationToken ct = default);
    Task<(byte[] Content, string ContentType, string FileName)> ExportAlertasAsync(string formato, CancellationToken ct = default);
    Task<(byte[] Content, string ContentType, string FileName)> ExportDashboardAsync(string formato, CancellationToken ct = default);
}

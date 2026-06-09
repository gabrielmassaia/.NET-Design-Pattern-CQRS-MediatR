using PainelObrigacoes.Application.Dashboard.ViewModels;

namespace PainelObrigacoes.Application.Dashboard.Services;

public interface IDashboardExportService
{
    byte[] ToCsvAlertas(IList<AlertaResultViewModel> alertas);
    byte[] ToPdfAlertas(IList<AlertaResultViewModel> alertas);
    byte[] ToCsvDashboard(DashboardResultViewModel dashboard, IList<AlertaResultViewModel> alertas);
    byte[] ToPdfDashboard(DashboardResultViewModel dashboard, IList<AlertaResultViewModel> alertas);
}

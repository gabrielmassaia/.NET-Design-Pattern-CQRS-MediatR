using PainelObrigacoes.Domain.Dashboard.Models;
using PainelObrigacoes.Domain.Shared.Queries;

namespace PainelObrigacoes.Domain.Dashboard.Queries;

public sealed class GetDashboardQuery : Query<DashboardModel>
{
    public int? Ano { get; init; }
    public int? Mes { get; init; }
}

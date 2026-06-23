using CleanArchReference.Domain.Dashboard.Models;
using CleanArchReference.Domain.Shared.Queries;

namespace CleanArchReference.Domain.Dashboard.Queries;

public sealed class GetDashboardQuery : Query<DashboardModel>
{
    public int? Ano { get; init; }
    public int? Mes { get; init; }
}

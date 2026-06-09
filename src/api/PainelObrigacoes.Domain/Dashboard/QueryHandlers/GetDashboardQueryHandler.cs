using MediatR;
using PainelObrigacoes.Domain.Dashboard.Models;
using PainelObrigacoes.Domain.Dashboard.Queries;
using PainelObrigacoes.Domain.Obrigacoes.Repositories;

namespace PainelObrigacoes.Domain.Dashboard.QueryHandlers;

public sealed class GetDashboardQueryHandler
    : IRequestHandler<GetDashboardQuery, DashboardModel>
{
    private readonly IObrigacaoRepository _repository;

    public GetDashboardQueryHandler(IObrigacaoRepository repository)
        => _repository = repository;

    public Task<DashboardModel> Handle(
        GetDashboardQuery query, CancellationToken cancellationToken)
    {
        var agora = DateTime.UtcNow;
        return _repository.GetDashboardCountsAsync(agora.Year, agora.Month);
    }
}

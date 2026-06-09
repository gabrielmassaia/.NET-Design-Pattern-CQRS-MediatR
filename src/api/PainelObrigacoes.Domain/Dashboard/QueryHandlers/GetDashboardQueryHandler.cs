using MediatR;
using PainelObrigacoes.Domain.Dashboard.Models;
using PainelObrigacoes.Domain.Dashboard.Queries;
using PainelObrigacoes.Domain.Obrigacoes.Repositories;
using PainelObrigacoes.Domain.Shared.Interfaces;

namespace PainelObrigacoes.Domain.Dashboard.QueryHandlers;

public sealed class GetDashboardQueryHandler
    : IRequestHandler<GetDashboardQuery, DashboardModel>
{
    private readonly IObrigacaoRepository _repository;
    private readonly IDateTimeProvider _clock;

    public GetDashboardQueryHandler(
        IObrigacaoRepository repository,
        IDateTimeProvider clock)
    {
        _repository = repository;
        _clock = clock;
    }

    public Task<DashboardModel> Handle(
        GetDashboardQuery query, CancellationToken cancellationToken)
    {
        var ano = query.Ano ?? _clock.CurrentYear;
        var mes = query.Mes ?? _clock.CurrentMonth;
        return _repository.GetDashboardCountsAsync(ano, mes);
    }
}

using MediatR;
using CleanArchReference.Domain.Dashboard.Models;
using CleanArchReference.Domain.Dashboard.Queries;
using CleanArchReference.Domain.Obrigacoes.Repositories;
using CleanArchReference.Domain.Shared.Interfaces;

namespace CleanArchReference.Domain.Dashboard.QueryHandlers;

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

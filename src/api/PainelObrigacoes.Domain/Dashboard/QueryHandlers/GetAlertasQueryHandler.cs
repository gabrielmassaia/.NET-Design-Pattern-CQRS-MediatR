using MediatR;
using PainelObrigacoes.Domain.Dashboard.Models;
using PainelObrigacoes.Domain.Dashboard.Queries;
using PainelObrigacoes.Domain.Obrigacoes.Repositories;
using PainelObrigacoes.Domain.Shared.Interfaces;

namespace PainelObrigacoes.Domain.Dashboard.QueryHandlers;

public sealed class GetAlertasQueryHandler
    : IRequestHandler<GetAlertasQuery, IList<AlertaModel>>
{
    private readonly IObrigacaoRepository _repository;
    private readonly IDateTimeProvider _clock;

    public GetAlertasQueryHandler(
        IObrigacaoRepository repository,
        IDateTimeProvider clock)
    {
        _repository = repository;
        _clock = clock;
    }

    public Task<IList<AlertaModel>> Handle(
        GetAlertasQuery query, CancellationToken cancellationToken)
        => _repository.FindAlertasAsync(_clock.UtcNow.AddDays(30), limite: 1000);
}

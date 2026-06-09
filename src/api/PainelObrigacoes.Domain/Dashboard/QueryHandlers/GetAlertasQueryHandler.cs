using MediatR;
using PainelObrigacoes.Domain.Dashboard.Models;
using PainelObrigacoes.Domain.Dashboard.Queries;
using PainelObrigacoes.Domain.Obrigacoes.Repositories;

namespace PainelObrigacoes.Domain.Dashboard.QueryHandlers;

public sealed class GetAlertasQueryHandler
    : IRequestHandler<GetAlertasQuery, IList<AlertaModel>>
{
    private readonly IObrigacaoRepository _repository;

    public GetAlertasQueryHandler(IObrigacaoRepository repository)
        => _repository = repository;

    public Task<IList<AlertaModel>> Handle(
        GetAlertasQuery query, CancellationToken cancellationToken)
        => _repository.FindAlertasAsync(DateTime.UtcNow.AddDays(30), limite: 50);
}

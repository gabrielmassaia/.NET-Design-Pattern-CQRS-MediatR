using MediatR;
using PainelObrigacoes.Domain.Obrigacoes.Models;
using PainelObrigacoes.Domain.Obrigacoes.Queries;
using PainelObrigacoes.Domain.Obrigacoes.Repositories;

namespace PainelObrigacoes.Domain.Obrigacoes.QueryHandlers;

public sealed class GetHistoricoEmpresaQueryHandler
    : IRequestHandler<GetHistoricoEmpresaQuery, IList<ObrigacaoReadModel>>
{
    private readonly IObrigacaoRepository _repository;

    public GetHistoricoEmpresaQueryHandler(IObrigacaoRepository repository)
        => _repository = repository;

    public Task<IList<ObrigacaoReadModel>> Handle(
        GetHistoricoEmpresaQuery query, CancellationToken cancellationToken)
        => _repository.FindEntreguesByEmpresaAsync(query.EmpresaId);
}

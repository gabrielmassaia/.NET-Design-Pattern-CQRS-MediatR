using MediatR;
using CleanArchReference.Domain.Obrigacoes.Models;
using CleanArchReference.Domain.Obrigacoes.Queries;
using CleanArchReference.Domain.Obrigacoes.Repositories;

namespace CleanArchReference.Domain.Obrigacoes.QueryHandlers;

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

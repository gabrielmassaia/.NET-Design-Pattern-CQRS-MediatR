using MediatR;
using PainelObrigacoes.Domain.Empresas.Models;
using PainelObrigacoes.Domain.Empresas.Queries;
using PainelObrigacoes.Domain.Empresas.Repositories;

namespace PainelObrigacoes.Domain.Empresas.QueryHandlers;

public sealed class FindEmpresasQueryHandler
    : IRequestHandler<FindEmpresasQuery, IList<EmpresaModel>>
{
    private readonly IEmpresaRepository _repository;

    public FindEmpresasQueryHandler(IEmpresaRepository repository)
        => _repository = repository;

    public Task<IList<EmpresaModel>> Handle(
        FindEmpresasQuery query, CancellationToken cancellationToken)
        => _repository.FindAllAsync(query.Skip, query.Take);
}

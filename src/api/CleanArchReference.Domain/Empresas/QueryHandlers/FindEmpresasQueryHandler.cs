using MediatR;
using CleanArchReference.Domain.Empresas.Models;
using CleanArchReference.Domain.Empresas.Queries;
using CleanArchReference.Domain.Empresas.Repositories;

namespace CleanArchReference.Domain.Empresas.QueryHandlers;

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

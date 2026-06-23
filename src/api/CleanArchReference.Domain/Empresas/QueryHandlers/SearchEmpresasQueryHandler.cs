using MediatR;
using CleanArchReference.Domain.Empresas.Models;
using CleanArchReference.Domain.Empresas.Queries;
using CleanArchReference.Domain.Empresas.Services;

namespace CleanArchReference.Domain.Empresas.QueryHandlers;

public sealed class SearchEmpresasQueryHandler
    : IRequestHandler<SearchEmpresasQuery, IList<EmpresaModel>>
{
    private readonly IEmpresaSearchService _searchService;

    public SearchEmpresasQueryHandler(IEmpresaSearchService searchService)
        => _searchService = searchService;

    public Task<IList<EmpresaModel>> Handle(
        SearchEmpresasQuery query, CancellationToken cancellationToken)
        => _searchService.SearchAsync(query.Query, cancellationToken);
}

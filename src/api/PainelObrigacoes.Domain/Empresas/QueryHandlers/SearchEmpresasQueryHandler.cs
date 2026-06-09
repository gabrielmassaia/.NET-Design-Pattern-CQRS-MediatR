using MediatR;
using PainelObrigacoes.Domain.Empresas.Models;
using PainelObrigacoes.Domain.Empresas.Queries;
using PainelObrigacoes.Domain.Empresas.Services;

namespace PainelObrigacoes.Domain.Empresas.QueryHandlers;

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

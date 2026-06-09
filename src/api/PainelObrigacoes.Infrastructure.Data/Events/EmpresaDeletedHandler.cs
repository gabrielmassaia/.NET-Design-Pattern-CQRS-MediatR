using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using PainelObrigacoes.Domain.Empresas.Events;
using PainelObrigacoes.Domain.Empresas.Services;

namespace PainelObrigacoes.Infrastructure.Data.Events;

public sealed class EmpresaDeletedHandler : INotificationHandler<EmpresaDeletedEvent>
{
    private readonly IEmpresaSearchService _searchService;
    private readonly IDistributedCache _cache;

    public EmpresaDeletedHandler(IEmpresaSearchService searchService, IDistributedCache cache)
    {
        _searchService = searchService;
        _cache = cache;
    }

    public async Task Handle(EmpresaDeletedEvent notification, CancellationToken cancellationToken)
    {
        await _searchService.DeleteFromIndexAsync(notification.EmpresaId, cancellationToken);

        var now = DateTime.UtcNow;
        await Task.WhenAll(
            _cache.RemoveAsync($"dashboard:{now.Year}:{now.Month}", cancellationToken),
            _cache.RemoveAsync("alertas:current", cancellationToken)
        );
    }
}

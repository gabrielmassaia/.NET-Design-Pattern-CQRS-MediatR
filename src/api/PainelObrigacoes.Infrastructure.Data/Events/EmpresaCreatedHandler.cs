using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using PainelObrigacoes.Domain.Empresas.Events;
using PainelObrigacoes.Domain.Empresas.Models;
using PainelObrigacoes.Domain.Empresas.Services;

namespace PainelObrigacoes.Infrastructure.Data.Events;

public sealed class EmpresaCreatedHandler : INotificationHandler<EmpresaCreatedEvent>
{
    private readonly IEmpresaSearchService _searchService;
    private readonly IDistributedCache _cache;

    public EmpresaCreatedHandler(IEmpresaSearchService searchService, IDistributedCache cache)
    {
        _searchService = searchService;
        _cache = cache;
    }

    public async Task Handle(EmpresaCreatedEvent notification, CancellationToken cancellationToken)
    {
        var model = new EmpresaModel
        {
            Id = notification.EmpresaId,
            CNPJ = notification.CNPJ,
            RazaoSocial = notification.RazaoSocial,
            Regime = notification.Regime
        };

        await _searchService.IndexAsync(model, cancellationToken);

        var now = DateTime.UtcNow;
        await Task.WhenAll(
            _cache.RemoveAsync($"dashboard:{now.Year}:{now.Month}", cancellationToken),
            _cache.RemoveAsync("alertas:current", cancellationToken)
        );
    }
}

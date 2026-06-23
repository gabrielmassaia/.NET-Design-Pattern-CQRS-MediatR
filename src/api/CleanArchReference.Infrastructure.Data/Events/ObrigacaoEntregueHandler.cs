using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using CleanArchReference.Domain.Obrigacoes.Events;

namespace CleanArchReference.Infrastructure.Data.Events;

public sealed class ObrigacaoEntregueHandler : INotificationHandler<ObrigacaoEntregueEvent>
{
    private readonly IDistributedCache _cache;

    public ObrigacaoEntregueHandler(IDistributedCache cache)
    {
        _cache = cache;
    }

    public async Task Handle(ObrigacaoEntregueEvent notification, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var dashboardKey = $"dashboard:{now.Year}:{now.Month}";
        const string alertasKey = "alertas:current";

        await Task.WhenAll(
            _cache.RemoveAsync(dashboardKey, cancellationToken),
            _cache.RemoveAsync(alertasKey, cancellationToken)
        );
    }
}

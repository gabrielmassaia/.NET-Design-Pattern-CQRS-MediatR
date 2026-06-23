// ============================================================
// 🟠 FASE 4.3 — Event Handler (Side Effects)
// ============================================================
//
// Responsabilidade: "O que acontece DEPOIS da empresa ser criada"
//
// INotificationHandler<T> = interface do MediatR pra eventos
// Esse handler escuta EmpresaCreatedEvent
//
// AÇÕES QUE ACONTECEM AQUI:
//   1. Indexa a empresa no Meilisearch (busca full-text com typo tolerance)
//   2. Invalida cache do Redis (dashboard + alertas ficam desatualizados)
//
// POR QUE EM EVENTO SEPARADO?
//   - O handler principal não precisa ESPERAR a indexação terminar
//   - Se o Meilisearch estiver offline → a empresa AINDA foi criada
//   - Responsabilidade ÚNICA: handler cria, evento indexa
//   - Isso é eventual consistency = "dados eventualmente consistentes"
//
// FLUXO:
//   Handler cria empresa → publica EmpresaCreatedEvent
//   → EmpresaCreatedHandler roda em PARALELO (não bloqueia)
//   → Indexa no Meilisearch + limpa cache Redis
// ============================================================

using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using PainelObrigacoes.Domain.Empresas.Events;
using PainelObrigacoes.Domain.Empresas.Models;
using PainelObrigacoes.Domain.Empresas.Services;

namespace PainelObrigacoes.Infrastructure.Data.Events;

// INotificationHandler<EmpresaCreatedEvent>: diz pro MediatR
// "me chame quando alguém publicar um EmpresaCreatedEvent"
//
// Registrado no DI em EmpresaSetup.cs:
//   services.AddScoped<INotificationHandler<EmpresaCreatedEvent>, EmpresaCreatedHandler>()
public sealed class EmpresaCreatedHandler : INotificationHandler<EmpresaCreatedEvent>
{
    private readonly IEmpresaSearchService _searchService; // Serviço do Meilisearch
    private readonly IDistributedCache _cache;             // Redis cache

    public EmpresaCreatedHandler(IEmpresaSearchService searchService, IDistributedCache cache)
    {
        _searchService = searchService;
        _cache = cache;
    }

    public async Task Handle(EmpresaCreatedEvent notification, CancellationToken cancellationToken)
    {
        // PASSO 1: Reconstrói o Model a partir do Event (não precisa buscar no banco)
        var model = new EmpresaModel
        {
            Id = notification.EmpresaId,
            CNPJ = notification.CNPJ,
            RazaoSocial = notification.RazaoSocial,
            Regime = notification.Regime
        };

        // PASSO 2: Indexa no Meilisearch (busca full-text com typo tolerance)
        await _searchService.IndexAsync(model, cancellationToken);

        // PASSO 3: Invalida cache do Redis
        //   O dashboard e os alertas estavam cacheados com dados ANTIGOS
        //   Agora que tem uma nova empresa, o cache precisa ser recalculado
        var now = DateTime.UtcNow;
        await Task.WhenAll(
            _cache.RemoveAsync($"dashboard:{now.Year}:{now.Month}", cancellationToken),
            _cache.RemoveAsync("alertas:current", cancellationToken)
        );
    }
}

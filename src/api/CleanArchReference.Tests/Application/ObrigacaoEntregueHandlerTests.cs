using FluentAssertions;
using Microsoft.Extensions.Caching.Distributed;
using Moq;
using CleanArchReference.Domain.Obrigacoes.Events;
using CleanArchReference.Infrastructure.Data.Events;

namespace CleanArchReference.Tests.Application;

public class ObrigacaoEntregueHandlerTests
{
    private readonly Mock<IDistributedCache> _cacheMock = new();
    private readonly ObrigacaoEntregueHandler _handler;

    public ObrigacaoEntregueHandlerTests()
    {
        _handler = new ObrigacaoEntregueHandler(_cacheMock.Object);
    }

    [Fact]
    public async Task Handle_DeveInvalidarCacheDashboardEAlertas()
    {
        var evento = new ObrigacaoEntregueEvent(Guid.NewGuid());

        await _handler.Handle(evento, CancellationToken.None);

        _cacheMock.Verify(c => c.RemoveAsync(It.Is<string>(k => k.StartsWith("dashboard:")), It.IsAny<CancellationToken>()), Times.Once);
        _cacheMock.Verify(c => c.RemoveAsync("alertas:current", It.IsAny<CancellationToken>()), Times.Once);
    }
}

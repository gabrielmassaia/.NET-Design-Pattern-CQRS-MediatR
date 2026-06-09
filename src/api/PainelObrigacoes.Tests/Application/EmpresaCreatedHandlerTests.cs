using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Moq;
using PainelObrigacoes.Domain.Empresas.Events;
using PainelObrigacoes.Domain.Empresas.Models;
using PainelObrigacoes.Domain.Empresas.Services;
using PainelObrigacoes.Domain.Enums;
using PainelObrigacoes.Infrastructure.Data.Events;

namespace PainelObrigacoes.Tests.Application;

public class EmpresaCreatedHandlerTests
{
    private readonly Mock<IEmpresaSearchService> _searchMock = new();
    private readonly Mock<IDistributedCache> _cacheMock = new();
    private readonly EmpresaCreatedHandler _handler;

    public EmpresaCreatedHandlerTests()
    {
        _handler = new EmpresaCreatedHandler(_searchMock.Object, _cacheMock.Object);
    }

    [Fact]
    public async Task Handle_DeveIndexarSearchEInvalidarCache()
    {
        var evento = new EmpresaCreatedEvent(Guid.NewGuid(), "11222333000181", "Empresa Teste", RegimeTributario.SimplesNacional);

        await _handler.Handle(evento, CancellationToken.None);

        _searchMock.Verify(s => s.IndexAsync(It.IsAny<EmpresaModel>(), It.IsAny<CancellationToken>()), Times.Once);
        _cacheMock.Verify(c => c.RemoveAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Exactly(2));
    }
}

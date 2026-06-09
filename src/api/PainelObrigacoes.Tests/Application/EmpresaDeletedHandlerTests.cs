using FluentAssertions;
using Microsoft.Extensions.Caching.Distributed;
using Moq;
using PainelObrigacoes.Domain.Empresas.Events;
using PainelObrigacoes.Domain.Empresas.Services;
using PainelObrigacoes.Infrastructure.Data.Events;

namespace PainelObrigacoes.Tests.Application;

public class EmpresaDeletedHandlerTests
{
    private readonly Mock<IEmpresaSearchService> _searchMock = new();
    private readonly Mock<IDistributedCache> _cacheMock = new();
    private readonly EmpresaDeletedHandler _handler;

    public EmpresaDeletedHandlerTests()
    {
        _handler = new EmpresaDeletedHandler(_searchMock.Object, _cacheMock.Object);
    }

    [Fact]
    public async Task Handle_DeveRemoverDoSearchEInvalidarCache()
    {
        var empresaId = Guid.NewGuid();
        var evento = new EmpresaDeletedEvent(empresaId);

        await _handler.Handle(evento, CancellationToken.None);

        _searchMock.Verify(s => s.DeleteFromIndexAsync(empresaId, It.IsAny<CancellationToken>()), Times.Once);
        _cacheMock.Verify(c => c.RemoveAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Exactly(2));
    }
}

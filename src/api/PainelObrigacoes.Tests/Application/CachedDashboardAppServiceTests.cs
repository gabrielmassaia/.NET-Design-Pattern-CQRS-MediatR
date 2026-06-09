using System.Text;
using System.Text.Json;
using FluentAssertions;
using Microsoft.Extensions.Caching.Distributed;
using Moq;
using PainelObrigacoes.Application.Dashboard.Services;
using PainelObrigacoes.Application.Dashboard.ViewModels;
using PainelObrigacoes.Domain.Enums;

namespace PainelObrigacoes.Tests.Application;

public class CachedDashboardAppServiceTests
{
    private readonly Mock<IDashboardAppService> _innerMock = new();
    private readonly Mock<IDistributedCache> _cacheMock = new();
    private readonly CachedDashboardAppService _service;

    public CachedDashboardAppServiceTests()
    {
        _service = new CachedDashboardAppService(_innerMock.Object, _cacheMock.Object);
    }

    [Fact]
    public async Task GetDashboardAsync_QuandoCacheHit_DeveRetornarDadosDoCache()
    {
        var expected = new DashboardResultViewModel { TotalEmpresas = 10 };
        var cachedJson = JsonSerializer.Serialize(expected);
        var cachedBytes = Encoding.UTF8.GetBytes(cachedJson);

        _cacheMock.Setup(c => c.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(cachedBytes);

        var result = await _service.GetDashboardAsync();

        result.TotalEmpresas.Should().Be(10);
        _innerMock.Verify(i => i.GetDashboardAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task GetDashboardAsync_QuandoCacheMiss_DeveChamarInnerECachear()
    {
        var expected = new DashboardResultViewModel { TotalEmpresas = 20 };

        _cacheMock.Setup(c => c.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((byte[]?)null);
        _innerMock.Setup(i => i.GetDashboardAsync(It.IsAny<CancellationToken>())).ReturnsAsync(expected);

        var result = await _service.GetDashboardAsync();

        result.TotalEmpresas.Should().Be(20);
        _cacheMock.Verify(c => c.SetAsync(
            It.IsAny<string>(),
            It.IsAny<byte[]>(),
            It.IsAny<DistributedCacheEntryOptions>(),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetAlertasAsync_QuandoCacheHit_DeveRetornarAlertasDoCache()
    {
        var expected = new List<AlertaResultViewModel> { new() { Id = Guid.NewGuid() } };
        var cachedJson = JsonSerializer.Serialize(expected);
        var cachedBytes = Encoding.UTF8.GetBytes(cachedJson);

        _cacheMock.Setup(c => c.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(cachedBytes);

        var result = await _service.GetAlertasAsync();

        result.Should().HaveCount(1);
        _innerMock.Verify(i => i.GetAlertasAsync(It.IsAny<CancellationToken>()), Times.Never);
    }
}

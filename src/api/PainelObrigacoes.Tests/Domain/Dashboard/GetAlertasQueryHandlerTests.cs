using FluentAssertions;
using Moq;
using PainelObrigacoes.Domain.Dashboard.Models;
using PainelObrigacoes.Domain.Dashboard.Queries;
using PainelObrigacoes.Domain.Dashboard.QueryHandlers;
using PainelObrigacoes.Domain.Enums;
using PainelObrigacoes.Domain.Obrigacoes.Repositories;
using PainelObrigacoes.Domain.Shared.Interfaces;

namespace PainelObrigacoes.Tests.Domain.Dashboard;

public class GetAlertasQueryHandlerTests
{
    private readonly Mock<IObrigacaoRepository> _repositoryMock = new();
    private readonly Mock<IDateTimeProvider> _clockMock = new();
    private readonly GetAlertasQueryHandler _handler;
    private static readonly DateTime FixedNow = new(2026, 6, 9, 12, 0, 0, DateTimeKind.Utc);

    public GetAlertasQueryHandlerTests()
    {
        _clockMock.Setup(c => c.UtcNow).Returns(FixedNow);
        _handler = new GetAlertasQueryHandler(_repositoryMock.Object, _clockMock.Object);
    }

    [Fact]
    public async Task Handle_DeveRetornarAlertasDosProximos30Dias()
    {
        var alertas = new List<AlertaModel>
        {
            new() { Id = Guid.NewGuid(), Tipo = TipoObrigacao.DAS, DiasRestantes = 5, Status = StatusObrigacao.Pendente },
            new() { Id = Guid.NewGuid(), Tipo = TipoObrigacao.DCTF, DiasRestantes = -1, Status = StatusObrigacao.Atrasada }
        };

        var dataLimite = FixedNow.AddDays(30);
        _repositoryMock.Setup(r => r.FindAlertasAsync(
            It.Is<DateTime>(d => d.Date == dataLimite.Date), 1000)).ReturnsAsync(alertas);

        var result = await _handler.Handle(new GetAlertasQuery(), CancellationToken.None);

        result.Should().HaveCount(2);
        result.Should().Contain(a => a.Status == StatusObrigacao.Atrasada);
        result.Should().Contain(a => a.Status == StatusObrigacao.Pendente);
    }

    [Fact]
    public async Task Handle_QuandoSemAlertas_DeveRetornarListaVazia()
    {
        var dataLimite = FixedNow.AddDays(30);
        _repositoryMock.Setup(r => r.FindAlertasAsync(
            It.Is<DateTime>(d => d.Date == dataLimite.Date), 1000))
            .ReturnsAsync(new List<AlertaModel>());

        var result = await _handler.Handle(new GetAlertasQuery(), CancellationToken.None);

        result.Should().BeEmpty();
    }
}

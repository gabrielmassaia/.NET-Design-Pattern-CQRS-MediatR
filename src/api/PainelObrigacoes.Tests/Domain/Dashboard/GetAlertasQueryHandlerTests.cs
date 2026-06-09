using FluentAssertions;
using Moq;
using PainelObrigacoes.Domain.Dashboard.Models;
using PainelObrigacoes.Domain.Dashboard.Queries;
using PainelObrigacoes.Domain.Dashboard.QueryHandlers;
using PainelObrigacoes.Domain.Enums;
using PainelObrigacoes.Domain.Obrigacoes.Repositories;

namespace PainelObrigacoes.Tests.Domain.Dashboard;

public class GetAlertasQueryHandlerTests
{
    private readonly Mock<IObrigacaoRepository> _repositoryMock = new();
    private readonly GetAlertasQueryHandler _handler;

    public GetAlertasQueryHandlerTests()
    {
        _handler = new GetAlertasQueryHandler(_repositoryMock.Object);
    }

    [Fact]
    public async Task Handle_DeveRetornarAlertasDosProximos30Dias()
    {
        var alertas = new List<AlertaModel>
        {
            new() { Id = Guid.NewGuid(), Tipo = TipoObrigacao.DAS, DiasRestantes = 5, Status = StatusObrigacao.Pendente },
            new() { Id = Guid.NewGuid(), Tipo = TipoObrigacao.DCTF, DiasRestantes = -1, Status = StatusObrigacao.Atrasada }
        };

        var dataLimite = DateTime.UtcNow.AddDays(30);
        _repositoryMock.Setup(r => r.FindAlertasAsync(It.Is<DateTime>(d => d.Date == dataLimite.Date), 50)).ReturnsAsync(alertas);

        var result = await _handler.Handle(new GetAlertasQuery(), CancellationToken.None);

        result.Should().HaveCount(2);
        result.Should().Contain(a => a.Status == StatusObrigacao.Atrasada);
        result.Should().Contain(a => a.Status == StatusObrigacao.Pendente);
    }

    [Fact]
    public async Task Handle_QuandoSemAlertas_DeveRetornarListaVazia()
    {
        var dataLimite = DateTime.UtcNow.AddDays(30);
        _repositoryMock.Setup(r => r.FindAlertasAsync(It.Is<DateTime>(d => d.Date == dataLimite.Date), 50))
            .ReturnsAsync(new List<AlertaModel>());

        var result = await _handler.Handle(new GetAlertasQuery(), CancellationToken.None);

        result.Should().BeEmpty();
    }
}

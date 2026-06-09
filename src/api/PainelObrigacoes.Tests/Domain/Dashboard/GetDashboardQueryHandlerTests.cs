using FluentAssertions;
using Moq;
using PainelObrigacoes.Domain.Dashboard.Models;
using PainelObrigacoes.Domain.Dashboard.Queries;
using PainelObrigacoes.Domain.Dashboard.QueryHandlers;
using PainelObrigacoes.Domain.Enums;
using PainelObrigacoes.Domain.Obrigacoes.Repositories;

namespace PainelObrigacoes.Tests.Domain.Dashboard;

public class GetDashboardQueryHandlerTests
{
    private readonly Mock<IObrigacaoRepository> _repositoryMock = new();
    private readonly GetDashboardQueryHandler _handler;

    public GetDashboardQueryHandlerTests()
    {
        _handler = new GetDashboardQueryHandler(_repositoryMock.Object);
    }

    [Fact]
    public async Task Handle_DeveRetornarDashboardDoMesAtual()
    {
        var dashboard = new DashboardModel
        {
            TotalEmpresas = 10,
            TotalObrigacoesMes = 50,
            Entregues = 20,
            Pendentes = 20,
            Atrasadas = 10
        };

        var agora = DateTime.UtcNow;
        _repositoryMock.Setup(r => r.GetDashboardCountsAsync(agora.Year, agora.Month)).ReturnsAsync(dashboard);

        var result = await _handler.Handle(new GetDashboardQuery(), CancellationToken.None);

        result.Should().NotBeNull();
        result.TotalEmpresas.Should().Be(10);
        result.TotalObrigacoesMes.Should().Be(50);
        result.Entregues.Should().Be(20);
        result.Pendentes.Should().Be(20);
        result.Atrasadas.Should().Be(10);
    }

    [Fact]
    public async Task Handle_QuandoSemDados_DeveRetornarDashboardZerado()
    {
        var agora = DateTime.UtcNow;
        _repositoryMock.Setup(r => r.GetDashboardCountsAsync(agora.Year, agora.Month))
            .ReturnsAsync(new DashboardModel());

        var result = await _handler.Handle(new GetDashboardQuery(), CancellationToken.None);

        result.TotalEmpresas.Should().Be(0);
        result.TotalObrigacoesMes.Should().Be(0);
    }
}

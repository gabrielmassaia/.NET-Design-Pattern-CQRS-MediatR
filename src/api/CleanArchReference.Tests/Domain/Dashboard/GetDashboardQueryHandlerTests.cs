using FluentAssertions;
using Moq;
using CleanArchReference.Domain.Dashboard.Models;
using CleanArchReference.Domain.Dashboard.Queries;
using CleanArchReference.Domain.Dashboard.QueryHandlers;
using CleanArchReference.Domain.Enums;
using CleanArchReference.Domain.Obrigacoes.Repositories;
using CleanArchReference.Domain.Shared.Interfaces;

namespace CleanArchReference.Tests.Domain.Dashboard;

public class GetDashboardQueryHandlerTests
{
    private readonly Mock<IObrigacaoRepository> _repositoryMock = new();
    private readonly Mock<IDateTimeProvider> _clockMock = new();
    private readonly GetDashboardQueryHandler _handler;

    public GetDashboardQueryHandlerTests()
    {
        _clockMock.Setup(c => c.CurrentYear).Returns(2026);
        _clockMock.Setup(c => c.CurrentMonth).Returns(6);
        _handler = new GetDashboardQueryHandler(_repositoryMock.Object, _clockMock.Object);
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

        _repositoryMock.Setup(r => r.GetDashboardCountsAsync(2026, 6)).ReturnsAsync(dashboard);

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
        _repositoryMock.Setup(r => r.GetDashboardCountsAsync(2026, 6))
            .ReturnsAsync(new DashboardModel());

        var result = await _handler.Handle(new GetDashboardQuery(), CancellationToken.None);

        result.TotalEmpresas.Should().Be(0);
        result.TotalObrigacoesMes.Should().Be(0);
    }
}

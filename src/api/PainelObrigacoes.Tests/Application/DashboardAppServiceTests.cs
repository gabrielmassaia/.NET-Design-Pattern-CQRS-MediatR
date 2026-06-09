using AutoMapper;
using FluentAssertions;
using Moq;
using PainelObrigacoes.Application.Dashboard.Services;
using PainelObrigacoes.Application.Dashboard.ViewModels;
using PainelObrigacoes.Domain.Dashboard.Models;
using PainelObrigacoes.Domain.Dashboard.Queries;
using PainelObrigacoes.Domain.Enums;
using PainelObrigacoes.Domain.Shared.Interfaces;

namespace PainelObrigacoes.Tests.Application;

public class DashboardAppServiceTests
{
    private readonly Mock<IMediatrService> _mediatorMock = new();
    private readonly Mock<IMapper> _mapperMock = new();
    private readonly Mock<IDashboardExportService> _exportMock = new();
    private readonly DashboardAppService _service;

    public DashboardAppServiceTests()
    {
        _service = new DashboardAppService(_mediatorMock.Object, _mapperMock.Object, _exportMock.Object);
    }

    [Fact]
    public async Task GetDashboardAsync_DeveChamarQueryEMapear()
    {
        var model = new DashboardModel { TotalEmpresas = 5, TotalObrigacoesMes = 30, Entregues = 10, Pendentes = 15, Atrasadas = 5 };
        var viewModel = new DashboardResultViewModel { TotalEmpresas = 5, TotalObrigacoesMes = 30, Entregues = 10, Pendentes = 15, Atrasadas = 5 };

        _mediatorMock.Setup(m => m.SendQuery(It.IsAny<GetDashboardQuery>(), It.IsAny<CancellationToken>())).ReturnsAsync(model);
        _mapperMock.Setup(m => m.Map<DashboardResultViewModel>(model)).Returns(viewModel);

        var result = await _service.GetDashboardAsync();

        result.Should().BeEquivalentTo(viewModel);
    }

    [Fact]
    public async Task GetAlertasAsync_DeveChamarQueryEMapear()
    {
        var models = new List<AlertaModel> { new() { Id = Guid.NewGuid(), DiasRestantes = 5, Status = StatusObrigacao.Pendente } };
        var viewModels = new List<AlertaResultViewModel> { new() { Id = models[0].Id, DiasRestantes = 5, Status = StatusObrigacao.Pendente } };

        _mediatorMock.Setup(m => m.SendQuery(It.IsAny<GetAlertasQuery>(), It.IsAny<CancellationToken>())).ReturnsAsync(models);
        _mapperMock.Setup(m => m.Map<IList<AlertaResultViewModel>>(models)).Returns(viewModels);

        var result = await _service.GetAlertasAsync();

        result.Should().BeEquivalentTo(viewModels);
    }

    [Fact]
    public async Task ExportAlertasAsync_DeveGerarCSV()
    {
        var models = new List<AlertaModel> { new() { Id = Guid.NewGuid() } };
        var viewModels = new List<AlertaResultViewModel> { new() { Id = models[0].Id } };
        var csvBytes = new byte[] { 1, 2, 3 };

        _mediatorMock.Setup(m => m.SendQuery(It.IsAny<GetAlertasQuery>(), It.IsAny<CancellationToken>())).ReturnsAsync(models);
        _mapperMock.Setup(m => m.Map<IList<AlertaResultViewModel>>(models)).Returns(viewModels);
        _exportMock.Setup(e => e.ToCsvAlertas(viewModels)).Returns(csvBytes);

        var result = await _service.ExportAlertasAsync("csv");

        result.Content.Should().BeEquivalentTo(csvBytes);
        result.ContentType.Should().Be("text/csv");
    }
}

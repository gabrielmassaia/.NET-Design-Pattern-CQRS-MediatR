using AutoMapper;
using FluentAssertions;
using Moq;
using PainelObrigacoes.Application.Obrigacoes.Services;
using PainelObrigacoes.Application.Obrigacoes.ViewModels;
using PainelObrigacoes.Domain.Enums;
using PainelObrigacoes.Domain.Obrigacoes.Commands;
using PainelObrigacoes.Domain.Obrigacoes.Models;
using PainelObrigacoes.Domain.Obrigacoes.Queries;
using PainelObrigacoes.Domain.Shared.Interfaces;

namespace PainelObrigacoes.Tests.Application;

public class ObrigacaoAppServiceTests
{
    private readonly Mock<IMediatrService> _mediatorMock = new();
    private readonly Mock<IMapper> _mapperMock = new();
    private readonly Mock<IObrigacaoExportService> _exportMock = new();
    private readonly ObrigacaoAppService _service;

    public ObrigacaoAppServiceTests()
    {
        _service = new ObrigacaoAppService(_mediatorMock.Object, _mapperMock.Object, _exportMock.Object);
    }

    [Fact]
    public async Task FindAsync_DeveMapearViewModelParaQueryERetornarResultado()
    {
        var viewModel = new FindObrigacoesViewModel { EmpresaId = Guid.NewGuid(), Ano = 2024, Mes = 6 };
        var query = new FindObrigacoesQuery();
        var models = new List<ObrigacaoReadModel> { new() { Id = Guid.NewGuid(), EmpresaId = viewModel.EmpresaId, Tipo = TipoObrigacao.DAS } };
        var viewModels = new List<ObrigacaoResultViewModel> { new() { Id = models[0].Id, Tipo = TipoObrigacao.DAS } };

        _mapperMock.Setup(m => m.Map<FindObrigacoesQuery>(viewModel)).Returns(query);
        _mediatorMock.Setup(m => m.SendQuery(query, It.IsAny<CancellationToken>())).ReturnsAsync(models);
        _mapperMock.Setup(m => m.Map<IList<ObrigacaoResultViewModel>>(models)).Returns(viewModels);

        var result = await _service.FindAsync(viewModel);

        result.Should().BeEquivalentTo(viewModels);
    }

    [Fact]
    public async Task RegistrarEntregaAsync_DeveMapearEChamarMediator()
    {
        var id = Guid.NewGuid();
        var viewModel = new RegistrarEntregaViewModel { DataEntrega = DateTime.UtcNow };
        var model = new ObrigacaoModel { Id = id, DataEntrega = DateTime.UtcNow, Status = StatusObrigacao.Entregue };
        var resultViewModel = new ObrigacaoResultViewModel { Id = id, Status = StatusObrigacao.Entregue };

        _mediatorMock.Setup(m => m.SendCommand(It.Is<RegistrarEntregaCommand>(c => c.Id == id), It.IsAny<CancellationToken>()))
            .ReturnsAsync(model);
        _mapperMock.Setup(m => m.Map<ObrigacaoResultViewModel>(model)).Returns(resultViewModel);

        var result = await _service.RegistrarEntregaAsync(id, viewModel);

        result.Status.Should().Be(StatusObrigacao.Entregue);
    }

    [Fact]
    public async Task GetHistoricoAsync_DeveChamarMediatorComQuery()
    {
        var empresaId = Guid.NewGuid();
        var models = new List<ObrigacaoReadModel> { new() { Id = Guid.NewGuid(), EmpresaId = empresaId, Status = StatusObrigacao.Entregue } };
        var viewModels = new List<ObrigacaoResultViewModel> { new() { Id = models[0].Id, Status = StatusObrigacao.Entregue } };

        _mediatorMock.Setup(m => m.SendQuery(It.Is<GetHistoricoEmpresaQuery>(q => q.EmpresaId == empresaId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(models);
        _mapperMock.Setup(m => m.Map<IList<ObrigacaoResultViewModel>>(models)).Returns(viewModels);

        var result = await _service.GetHistoricoAsync(empresaId);

        result.Should().HaveCount(1);
        result[0].Status.Should().Be(StatusObrigacao.Entregue);
    }

    [Fact]
    public async Task ExportAsync_DeveGerarCSV()
    {
        var viewModel = new FindObrigacoesViewModel { EmpresaId = Guid.NewGuid(), Ano = 2024, Mes = 6 };
        var models = new List<ObrigacaoReadModel> { new() { Id = Guid.NewGuid(), Tipo = TipoObrigacao.DAS } };
        var viewModels = new List<ObrigacaoResultViewModel> { new() { Id = models[0].Id, Tipo = TipoObrigacao.DAS } };
        var csvBytes = new byte[] { 1, 2, 3 };

        _mapperMock.Setup(m => m.Map<FindObrigacoesQuery>(viewModel)).Returns(new FindObrigacoesQuery());
        _mediatorMock.Setup(m => m.SendQuery(It.IsAny<FindObrigacoesQuery>(), It.IsAny<CancellationToken>())).ReturnsAsync(models);
        _mapperMock.Setup(m => m.Map<IList<ObrigacaoResultViewModel>>(models)).Returns(viewModels);
        _exportMock.Setup(e => e.ToCsv(viewModels, 2024, 6)).Returns(csvBytes);

        var result = await _service.ExportAsync(viewModel, "csv");

        result.Content.Should().BeEquivalentTo(csvBytes);
        result.ContentType.Should().Be("text/csv");
    }
}

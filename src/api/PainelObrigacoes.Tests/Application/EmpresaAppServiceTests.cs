using AutoMapper;
using FluentAssertions;
using Moq;
using PainelObrigacoes.Application.Empresas.Services;
using PainelObrigacoes.Application.Empresas.ViewModels;
using PainelObrigacoes.Domain.Empresas.Models;
using PainelObrigacoes.Domain.Empresas.Commands;
using PainelObrigacoes.Domain.Empresas.Queries;
using PainelObrigacoes.Domain.Enums;
using PainelObrigacoes.Domain.Shared.Interfaces;
using Xunit;

namespace PainelObrigacoes.Tests.Application;

public class EmpresaAppServiceTests
{
    private readonly Mock<IMediatrService> _mediatorMock = new();
    private readonly Mock<IMapper> _mapperMock = new();
    private readonly EmpresaAppService _service;

    public EmpresaAppServiceTests()
    {
        _service = new EmpresaAppService(_mediatorMock.Object, _mapperMock.Object);
    }

    [Fact]
    public async Task FindAllAsync_DeveChamarMediatorEMapearRetorno()
    {
        var models = new List<EmpresaModel>
        {
            new() { Id = Guid.NewGuid(), CNPJ = "11222333000181", RazaoSocial = "Teste", Regime = RegimeTributario.SimplesNacional }
        };
        var viewModels = new List<EmpresaResultViewModel>
        {
            new() { Id = models[0].Id, CNPJ = models[0].CNPJ, RazaoSocial = models[0].RazaoSocial, Regime = models[0].Regime }
        };

        _mediatorMock.Setup(m => m.SendQuery(It.IsAny<FindEmpresasQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(models);
        _mapperMock.Setup(m => m.Map<IList<EmpresaResultViewModel>>(models))
            .Returns(viewModels);

        var result = await _service.FindAllAsync();

        result.Should().BeEquivalentTo(viewModels);
        _mediatorMock.Verify(m => m.SendQuery(It.IsAny<FindEmpresasQuery>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_DeveMapearViewModelParaCommandEChamarMediator()
    {
        var viewModel = new CreateEmpresaViewModel
        {
            CNPJ = "11222333000181",
            RazaoSocial = "Empresa Teste",
            Regime = RegimeTributario.SimplesNacional
        };
        var command = new CreateEmpresaCommand();
        var model = new EmpresaModel { Id = Guid.NewGuid(), CNPJ = "11222333000181", RazaoSocial = "Empresa Teste", Regime = RegimeTributario.SimplesNacional };
        var resultViewModel = new EmpresaResultViewModel { Id = model.Id, CNPJ = model.CNPJ, RazaoSocial = model.RazaoSocial, Regime = model.Regime };

        _mapperMock.Setup(m => m.Map<CreateEmpresaCommand>(viewModel)).Returns(command);
        _mediatorMock.Setup(m => m.SendCommand(command, It.IsAny<CancellationToken>())).ReturnsAsync(model);
        _mapperMock.Setup(m => m.Map<EmpresaResultViewModel>(model)).Returns(resultViewModel);

        var result = await _service.CreateAsync(viewModel);

        result.Should().BeEquivalentTo(resultViewModel);
        _mediatorMock.Verify(m => m.SendCommand(command, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_DeveChamarMediatorComIdCorreto()
    {
        var id = Guid.NewGuid();

        _mediatorMock.Setup(m => m.SendCommand(It.Is<DeleteEmpresaCommand>(c => c.Id == id), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var result = await _service.DeleteAsync(id);

        result.Should().BeTrue();
    }

    [Fact]
    public async Task SearchAsync_DeveChamarMediatorComQuery()
    {
        var query = "padaria";
        var models = new List<EmpresaModel>();
        var viewModels = new List<EmpresaResultViewModel>();

        _mediatorMock.Setup(m => m.SendQuery(It.Is<SearchEmpresasQuery>(q => q.Query == query), It.IsAny<CancellationToken>()))
            .ReturnsAsync(models);
        _mapperMock.Setup(m => m.Map<IList<EmpresaResultViewModel>>(models)).Returns(viewModels);

        var result = await _service.SearchAsync(query);

        result.Should().BeEquivalentTo(viewModels);
    }
}

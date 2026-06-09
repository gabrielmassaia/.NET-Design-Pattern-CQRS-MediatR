using FluentAssertions;
using MediatR;
using Moq;
using PainelObrigacoes.Domain.Empresas.Commands;
using PainelObrigacoes.Domain.Empresas.CommandHandlers;
using PainelObrigacoes.Domain.Empresas.Models;
using PainelObrigacoes.Domain.Empresas.Repositories;
using PainelObrigacoes.Domain.Enums;
using PainelObrigacoes.Domain.Obrigacoes.Models;
using PainelObrigacoes.Domain.Obrigacoes.Repositories;
using PainelObrigacoes.Domain.Obrigacoes.Services;
using PainelObrigacoes.Domain.Shared.Interfaces;
using Xunit;

namespace PainelObrigacoes.Tests.Domain.Empresas;

public class CreateEmpresaCommandHandlerTests
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock = new();
    private readonly Mock<IEmpresaRepository> _empresaRepoMock = new();
    private readonly Mock<IObrigacaoRepository> _obrigacaoRepoMock = new();
    private readonly Mock<ITributaryRulesEngine> _rulesEngineMock = new();
    private readonly Mock<IMediator> _mediatorMock = new();
    private readonly Mock<IDateTimeProvider> _clockMock = new();

    [Fact]
    public async Task Handle_EmJunho_DeveGerarApenasDeJunhoADezembro()
    {
        _clockMock.Setup(c => c.CurrentYear).Returns(2026);
        _clockMock.Setup(c => c.CurrentMonth).Returns(6);

        var handler = CreateHandler();
        var command = new CreateEmpresaCommand
        {
            CNPJ = "11222333000181",
            RazaoSocial = "Empresa Teste",
            Regime = RegimeTributario.SimplesNacional
        };

        _rulesEngineMock
            .Setup(r => r.GenerateObrigacoes(It.IsAny<EmpresaModel>(), 2026, It.IsAny<int>()))
            .Returns([]);

        await handler.Handle(command, CancellationToken.None);

        _rulesEngineMock.Verify(r => r.GenerateObrigacoes(It.IsAny<EmpresaModel>(), 2026, 6), Times.Once);
        _rulesEngineMock.Verify(r => r.GenerateObrigacoes(It.IsAny<EmpresaModel>(), 2026, 7), Times.Once);
        _rulesEngineMock.Verify(r => r.GenerateObrigacoes(It.IsAny<EmpresaModel>(), 2026, 8), Times.Once);
        _rulesEngineMock.Verify(r => r.GenerateObrigacoes(It.IsAny<EmpresaModel>(), 2026, 9), Times.Once);
        _rulesEngineMock.Verify(r => r.GenerateObrigacoes(It.IsAny<EmpresaModel>(), 2026, 10), Times.Once);
        _rulesEngineMock.Verify(r => r.GenerateObrigacoes(It.IsAny<EmpresaModel>(), 2026, 11), Times.Once);
        _rulesEngineMock.Verify(r => r.GenerateObrigacoes(It.IsAny<EmpresaModel>(), 2026, 12), Times.Once);

        _rulesEngineMock.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task Handle_EmJaneiro_DeveGerarAnoCompleto()
    {
        _clockMock.Setup(c => c.CurrentYear).Returns(2026);
        _clockMock.Setup(c => c.CurrentMonth).Returns(1);

        var handler = CreateHandler();
        var command = new CreateEmpresaCommand
        {
            CNPJ = "11222333000181",
            RazaoSocial = "Empresa Teste",
            Regime = RegimeTributario.SimplesNacional
        };

        _rulesEngineMock
            .Setup(r => r.GenerateObrigacoes(It.IsAny<EmpresaModel>(), 2026, It.IsAny<int>()))
            .Returns([]);

        await handler.Handle(command, CancellationToken.None);

        for (int mes = 1; mes <= 12; mes++)
            _rulesEngineMock.Verify(r => r.GenerateObrigacoes(It.IsAny<EmpresaModel>(), 2026, mes), Times.Once);
    }

    [Fact]
    public async Task Handle_EmDezembro_DeveGerarApenasDezembro()
    {
        _clockMock.Setup(c => c.CurrentYear).Returns(2026);
        _clockMock.Setup(c => c.CurrentMonth).Returns(12);

        var handler = CreateHandler();
        var command = new CreateEmpresaCommand
        {
            CNPJ = "11222333000181",
            RazaoSocial = "Empresa Teste",
            Regime = RegimeTributario.SimplesNacional
        };

        _rulesEngineMock
            .Setup(r => r.GenerateObrigacoes(It.IsAny<EmpresaModel>(), 2026, It.IsAny<int>()))
            .Returns([]);

        await handler.Handle(command, CancellationToken.None);

        _rulesEngineMock.Verify(r => r.GenerateObrigacoes(It.IsAny<EmpresaModel>(), 2026, 12), Times.Once);
        _rulesEngineMock.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task Handle_DevePersistirEmpresaEObrigacoesEComitar()
    {
        _clockMock.Setup(c => c.CurrentYear).Returns(2026);
        _clockMock.Setup(c => c.CurrentMonth).Returns(6);

        var handler = CreateHandler();
        var command = new CreateEmpresaCommand
        {
            CNPJ = "11222333000181",
            RazaoSocial = "Empresa Teste",
            Regime = RegimeTributario.SimplesNacional
        };

        _rulesEngineMock
            .Setup(r => r.GenerateObrigacoes(It.IsAny<EmpresaModel>(), 2026, It.IsAny<int>()))
            .Returns([]);

        var result = await handler.Handle(command, CancellationToken.None);

        result.Should().NotBeNull();
        result.RazaoSocial.Should().Be("Empresa Teste");
        _empresaRepoMock.Verify(r => r.Create(It.IsAny<EmpresaModel>()), Times.Once);
        _obrigacaoRepoMock.Verify(r => r.CreateRange(It.IsAny<IEnumerable<ObrigacaoModel>>()), Times.Once);
        _unitOfWorkMock.Verify(u => u.CompleteAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_QuandoCnpjDuplicado_DeveLancarInvalidOperation()
    {
        _clockMock.Setup(c => c.CurrentYear).Returns(2026);
        _clockMock.Setup(c => c.CurrentMonth).Returns(6);

        var handler = CreateHandler();
        var command = new CreateEmpresaCommand
        {
            CNPJ = "11222333000181",
            RazaoSocial = "Empresa Teste",
            Regime = RegimeTributario.SimplesNacional
        };

        _empresaRepoMock
            .Setup(r => r.ExistsByCnpjAsync("11222333000181"))
            .ReturnsAsync(true);

        var act = async () => await handler.Handle(command, CancellationToken.None);

        await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("CNPJ já cadastrado.");
        _unitOfWorkMock.Verify(u => u.CompleteAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    private CreateEmpresaCommandHandler CreateHandler()
    {
        return new CreateEmpresaCommandHandler(
            _unitOfWorkMock.Object,
            _empresaRepoMock.Object,
            _obrigacaoRepoMock.Object,
            _rulesEngineMock.Object,
            _mediatorMock.Object,
            _clockMock.Object);
    }
}

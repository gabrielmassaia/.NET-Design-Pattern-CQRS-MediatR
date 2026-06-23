using FluentAssertions;
using MediatR;
using Moq;
using CleanArchReference.Domain.Empresas.Commands;
using CleanArchReference.Domain.Empresas.CommandHandlers;
using CleanArchReference.Domain.Empresas.Models;
using CleanArchReference.Domain.Empresas.Repositories;
using CleanArchReference.Domain.Enums;
using CleanArchReference.Domain.Shared.Interfaces;
using Xunit;

namespace CleanArchReference.Tests.Domain.Empresas;

public class DeleteEmpresaCommandHandlerTests
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock = new();
    private readonly Mock<IEmpresaRepository> _empresaRepoMock = new();
    private readonly Mock<IMediator> _mediatorMock = new();
    private readonly DeleteEmpresaCommandHandler _handler;

    public DeleteEmpresaCommandHandlerTests()
    {
        _handler = new DeleteEmpresaCommandHandler(
            _unitOfWorkMock.Object,
            _empresaRepoMock.Object,
            _mediatorMock.Object);
    }

    [Fact]
    public async Task Handle_QuandoEmpresaExiste_DeveDeletarEComitar()
    {
        var id = Guid.NewGuid();
        var empresa = new EmpresaModel { Id = id, CNPJ = "11222333000181", RazaoSocial = "Teste", Regime = RegimeTributario.SimplesNacional };

        _empresaRepoMock.Setup(r => r.FindByIdAsync(id)).ReturnsAsync(empresa);

        var result = await _handler.Handle(new DeleteEmpresaCommand { Id = id }, CancellationToken.None);

        result.Should().BeTrue();
        _empresaRepoMock.Verify(r => r.Delete(empresa), Times.Once);
        _unitOfWorkMock.Verify(u => u.CompleteAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_QuandoEmpresaNaoExiste_DeveLancarKeyNotFoundException()
    {
        var id = Guid.NewGuid();

        _empresaRepoMock.Setup(r => r.FindByIdAsync(id)).ReturnsAsync((EmpresaModel?)null);

        var act = async () => await _handler.Handle(new DeleteEmpresaCommand { Id = id }, CancellationToken.None);

        await act.Should().ThrowAsync<KeyNotFoundException>().WithMessage("Empresa não encontrada.");
        _unitOfWorkMock.Verify(u => u.CompleteAsync(It.IsAny<CancellationToken>()), Times.Never);
    }
}

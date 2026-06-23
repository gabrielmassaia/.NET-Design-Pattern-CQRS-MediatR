using FluentAssertions;
using MediatR;
using Moq;
using CleanArchReference.Domain.Enums;
using CleanArchReference.Domain.Obrigacoes.CommandHandlers;
using CleanArchReference.Domain.Obrigacoes.Commands;
using CleanArchReference.Domain.Obrigacoes.Models;
using CleanArchReference.Domain.Obrigacoes.Repositories;
using CleanArchReference.Domain.Shared.Interfaces;
using Xunit;

namespace CleanArchReference.Tests.Domain.Obrigacoes;

public class RegistrarEntregaCommandHandlerTests
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock = new();
    private readonly Mock<IObrigacaoRepository> _repositoryMock = new();
    private readonly Mock<IMediator> _mediatorMock = new();
    private readonly RegistrarEntregaCommandHandler _handler;

    public RegistrarEntregaCommandHandlerTests()
    {
        _handler = new RegistrarEntregaCommandHandler(_unitOfWorkMock.Object, _repositoryMock.Object, _mediatorMock.Object);
    }

    [Fact]
    public async Task Handle_QuandoObrigacaoExisteENaoEntregue_DeveMarcarComoEntregueEComitar()
    {
        var id = Guid.NewGuid();
        var obrigacao = new ObrigacaoModel
        {
            Id = id,
            EmpresaId = Guid.NewGuid(),
            Tipo = TipoObrigacao.DAS,
            Competencia = new DateTime(2024, 1, 1),
            DataVencimento = new DateTime(2024, 2, 20),
            Status = StatusObrigacao.Pendente
        };

        _repositoryMock.Setup(r => r.FindByIdAsync(id)).ReturnsAsync(obrigacao);

        var result = await _handler.Handle(new RegistrarEntregaCommand { Id = id, DataEntrega = new DateTime(2024, 2, 19) }, CancellationToken.None);

        result.Should().NotBeNull();
        result.DataEntrega.Should().Be(new DateTime(2024, 2, 19));
        result.Status.Should().Be(StatusObrigacao.Entregue);
        _repositoryMock.Verify(r => r.Update(It.IsAny<ObrigacaoModel>()), Times.Once);
        _unitOfWorkMock.Verify(u => u.CompleteAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_QuandoObrigacaoNaoExiste_DeveLancarKeyNotFoundException()
    {
        var id = Guid.NewGuid();

        _repositoryMock.Setup(r => r.FindByIdAsync(id)).ReturnsAsync((ObrigacaoModel?)null);

        var act = async () => await _handler.Handle(new RegistrarEntregaCommand { Id = id }, CancellationToken.None);

        await act.Should().ThrowAsync<KeyNotFoundException>().WithMessage("Obrigação não encontrada.");
        _unitOfWorkMock.Verify(u => u.CompleteAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_QuandoObrigacaoJaEntregue_DeveLancarInvalidOperationException()
    {
        var id = Guid.NewGuid();
        var obrigacao = new ObrigacaoModel
        {
            Id = id,
            EmpresaId = Guid.NewGuid(),
            Tipo = TipoObrigacao.DAS,
            Competencia = new DateTime(2024, 1, 1),
            DataVencimento = new DateTime(2024, 2, 20),
            DataEntrega = new DateTime(2024, 2, 19),
            Status = StatusObrigacao.Entregue
        };

        _repositoryMock.Setup(r => r.FindByIdAsync(id)).ReturnsAsync(obrigacao);

        var act = async () => await _handler.Handle(new RegistrarEntregaCommand { Id = id }, CancellationToken.None);

        await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("Obrigação já foi marcada como entregue.");
        _unitOfWorkMock.Verify(u => u.CompleteAsync(It.IsAny<CancellationToken>()), Times.Never);
    }
}

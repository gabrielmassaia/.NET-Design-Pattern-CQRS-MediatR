using FluentAssertions;
using MediatR;
using Moq;
using PainelObrigacoes.Domain.Shared.Interfaces;
using PainelObrigacoes.Domain.Tags.CommandHandlers;
using PainelObrigacoes.Domain.Tags.Commands;
using PainelObrigacoes.Domain.Tags.Models;
using PainelObrigacoes.Domain.Tags.Repositories;
using Xunit;

namespace PainelObrigacoes.Tests.Domain.Tags;

public class CreateTagCommandHandlerTests
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock = new();
    private readonly Mock<ITagRepository> _repositoryMock = new();
    private readonly Mock<IMediator> _mediatorMock = new();
    private readonly CreateTagCommandHandler _handler;

    public CreateTagCommandHandlerTests()
    {
        _handler = new CreateTagCommandHandler(
            _unitOfWorkMock.Object,
            _repositoryMock.Object,
            _mediatorMock.Object);
    }

    [Fact]
    public async Task Handle_DeveCriarTagEComitarEPublicarEvento()
    {
        var command = new CreateTagCommand { Nome = "Urgente", Cor = "#FF0000" };

        var result = await _handler.Handle(command, CancellationToken.None);

        result.Should().NotBeNull();
        result.Nome.Should().Be("Urgente");
        result.Cor.Should().Be("#FF0000");
        _repositoryMock.Verify(r => r.Create(It.IsAny<TagModel>()), Times.Once);
        _unitOfWorkMock.Verify(u => u.CompleteAsync(It.IsAny<CancellationToken>()), Times.Once);
        _mediatorMock.Verify(m => m.Publish(It.IsAny<INotification>(), It.IsAny<CancellationToken>()), Times.Once);
    }
}

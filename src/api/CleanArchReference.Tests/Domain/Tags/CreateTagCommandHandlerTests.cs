using FluentAssertions;
using MediatR;
using Moq;
using CleanArchReference.Domain.Shared.Interfaces;
using CleanArchReference.Domain.Tags.CommandHandlers;
using CleanArchReference.Domain.Tags.Commands;
using CleanArchReference.Domain.Tags.Models;
using CleanArchReference.Domain.Tags.Repositories;
using Xunit;

namespace CleanArchReference.Tests.Domain.Tags;

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

using FluentAssertions;
using Moq;
using CleanArchReference.Domain.Shared.Interfaces;
using CleanArchReference.Domain.Tags.CommandHandlers;
using CleanArchReference.Domain.Tags.Commands;
using CleanArchReference.Domain.Tags.Models;
using CleanArchReference.Domain.Tags.Repositories;
using Xunit;

namespace CleanArchReference.Tests.Domain.Tags;

public class DeleteTagCommandHandlerTests
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock = new();
    private readonly Mock<ITagRepository> _repositoryMock = new();
    private readonly DeleteTagCommandHandler _handler;

    public DeleteTagCommandHandlerTests()
    {
        _handler = new DeleteTagCommandHandler(
            _unitOfWorkMock.Object,
            _repositoryMock.Object);
    }

    [Fact]
    public async Task Handle_QuandoTagExiste_DeveDeletarEComitar()
    {
        var id = Guid.NewGuid();
        var tag = new TagModel { Id = id, Nome = "Urgente", Cor = "#FF0000" };

        _repositoryMock.Setup(r => r.FindByIdAsync(id)).ReturnsAsync(tag);

        var result = await _handler.Handle(new DeleteTagCommand { Id = id }, CancellationToken.None);

        result.Should().BeTrue();
        _repositoryMock.Verify(r => r.Delete(tag), Times.Once);
        _unitOfWorkMock.Verify(u => u.CompleteAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_QuandoTagNaoExiste_DeveLancarKeyNotFoundException()
    {
        var id = Guid.NewGuid();

        _repositoryMock.Setup(r => r.FindByIdAsync(id)).ReturnsAsync((TagModel?)null);

        var act = async () => await _handler.Handle(new DeleteTagCommand { Id = id }, CancellationToken.None);

        await act.Should().ThrowAsync<KeyNotFoundException>().WithMessage("Tag não encontrada.");
        _unitOfWorkMock.Verify(u => u.CompleteAsync(It.IsAny<CancellationToken>()), Times.Never);
    }
}

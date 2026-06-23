using FluentAssertions;
using Moq;
using PainelObrigacoes.Domain.Enums;
using PainelObrigacoes.Domain.Obrigacoes.Models;
using PainelObrigacoes.Domain.Obrigacoes.Repositories;
using PainelObrigacoes.Domain.Shared.Interfaces;
using PainelObrigacoes.Domain.Tags.CommandHandlers;
using PainelObrigacoes.Domain.Tags.Commands;
using PainelObrigacoes.Domain.Tags.Models;
using PainelObrigacoes.Domain.Tags.Repositories;
using Xunit;

namespace PainelObrigacoes.Tests.Domain.Tags;

public class VincularTagsCommandHandlerTests
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock = new();
    private readonly Mock<IObrigacaoRepository> _obrigacaoRepoMock = new();
    private readonly Mock<ITagRepository> _tagRepoMock = new();
    private readonly VincularTagsCommandHandler _handler;

    public VincularTagsCommandHandlerTests()
    {
        _handler = new VincularTagsCommandHandler(
            _unitOfWorkMock.Object,
            _obrigacaoRepoMock.Object,
            _tagRepoMock.Object);
    }

    [Fact]
    public async Task Handle_QuandoObrigacaoExiste_DeveVincularTagsEComitar()
    {
        var obrigacaoId = Guid.NewGuid();
        var tagId = Guid.NewGuid();
        var obrigacao = new ObrigacaoModel
        {
            Id = obrigacaoId,
            EmpresaId = Guid.NewGuid(),
            Tipo = TipoObrigacao.DAS,
            Competencia = new DateTime(2024, 1, 1),
            DataVencimento = new DateTime(2024, 2, 20),
            Status = StatusObrigacao.Pendente
        };

        _obrigacaoRepoMock.Setup(r => r.FindByIdAsync(obrigacaoId)).ReturnsAsync(obrigacao);
        _tagRepoMock.Setup(r => r.FindByObrigacaoAsync(obrigacaoId)).ReturnsAsync([]);

        var result = await _handler.Handle(
            new VincularTagsCommand { ObrigacaoId = obrigacaoId, TagIds = [tagId] },
            CancellationToken.None);

        result.Should().NotBeNull();
        _obrigacaoRepoMock.Verify(r => r.AdicionarTag(obrigacaoId, tagId), Times.Once);
        _unitOfWorkMock.Verify(u => u.CompleteAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_QuandoTagJaVinculada_DeveRemover()
    {
        var obrigacaoId = Guid.NewGuid();
        var tagId = Guid.NewGuid();
        var obrigacao = new ObrigacaoModel
        {
            Id = obrigacaoId,
            EmpresaId = Guid.NewGuid(),
            Tipo = TipoObrigacao.DAS,
            Competencia = new DateTime(2024, 1, 1),
            DataVencimento = new DateTime(2024, 2, 20),
            Status = StatusObrigacao.Pendente
        };

        _obrigacaoRepoMock.Setup(r => r.FindByIdAsync(obrigacaoId)).ReturnsAsync(obrigacao);
        _tagRepoMock.Setup(r => r.FindByObrigacaoAsync(obrigacaoId))
            .ReturnsAsync([new TagModel { Id = tagId, Nome = "Urgente", Cor = "#FF0000" }]);

        var result = await _handler.Handle(
            new VincularTagsCommand { ObrigacaoId = obrigacaoId, TagIds = [] },
            CancellationToken.None);

        result.Should().NotBeNull();
        _obrigacaoRepoMock.Verify(r => r.RemoverTag(obrigacaoId, tagId), Times.Once);
        _unitOfWorkMock.Verify(u => u.CompleteAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_QuandoObrigacaoNaoExiste_DeveLancarKeyNotFoundException()
    {
        var id = Guid.NewGuid();

        _obrigacaoRepoMock.Setup(r => r.FindByIdAsync(id)).ReturnsAsync((ObrigacaoModel?)null);

        var act = async () => await _handler.Handle(
            new VincularTagsCommand { ObrigacaoId = id, TagIds = [Guid.NewGuid()] },
            CancellationToken.None);

        await act.Should().ThrowAsync<KeyNotFoundException>().WithMessage("Obrigação não encontrada.");
        _unitOfWorkMock.Verify(u => u.CompleteAsync(It.IsAny<CancellationToken>()), Times.Never);
    }
}

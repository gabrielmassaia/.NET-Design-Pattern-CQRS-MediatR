using MediatR;
using PainelObrigacoes.Domain.Obrigacoes.Models;
using PainelObrigacoes.Domain.Obrigacoes.Repositories;
using PainelObrigacoes.Domain.Shared.Interfaces;
using PainelObrigacoes.Domain.Tags.Commands;
using PainelObrigacoes.Domain.Tags.Repositories;

namespace PainelObrigacoes.Domain.Tags.CommandHandlers;

public sealed class VincularTagsCommandHandler : IRequestHandler<VincularTagsCommand, ObrigacaoModel>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IObrigacaoRepository _obrigacaoRepository;
    private readonly ITagRepository _tagRepository;

    public VincularTagsCommandHandler(
        IUnitOfWork unitOfWork,
        IObrigacaoRepository obrigacaoRepository,
        ITagRepository tagRepository)
    {
        _unitOfWork = unitOfWork;
        _obrigacaoRepository = obrigacaoRepository;
        _tagRepository = tagRepository;
    }

    public async Task<ObrigacaoModel> Handle(VincularTagsCommand command, CancellationToken cancellationToken)
    {
        var obrigacao = await _obrigacaoRepository.FindByIdAsync(command.ObrigacaoId)
            ?? throw new KeyNotFoundException("Obrigação não encontrada.");

        var tagsExistentes = await _tagRepository.FindByObrigacaoAsync(command.ObrigacaoId);
        var tagsExistentesIds = tagsExistentes.Select(t => t.Id).ToHashSet();
        var tagsSolicitadasIds = command.TagIds.ToHashSet();

        var tagsParaRemover = tagsExistentesIds.Except(tagsSolicitadasIds).ToList();
        var tagsParaAdicionar = tagsSolicitadasIds.Except(tagsExistentesIds).ToList();

        foreach (var tagId in tagsParaRemover)
            _obrigacaoRepository.RemoverTag(command.ObrigacaoId, tagId);

        foreach (var tagId in tagsParaAdicionar)
            _obrigacaoRepository.AdicionarTag(command.ObrigacaoId, tagId);

        obrigacao.UpdatedAt = DateTime.UtcNow;
        _obrigacaoRepository.Update(obrigacao);
        await _unitOfWork.CompleteAsync(cancellationToken);

        return obrigacao;
    }
}

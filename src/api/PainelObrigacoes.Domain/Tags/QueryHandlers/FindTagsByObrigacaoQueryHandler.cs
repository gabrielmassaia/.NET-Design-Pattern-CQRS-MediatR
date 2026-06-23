using MediatR;
using PainelObrigacoes.Domain.Tags.Models;
using PainelObrigacoes.Domain.Tags.Queries;
using PainelObrigacoes.Domain.Tags.Repositories;

namespace PainelObrigacoes.Domain.Tags.QueryHandlers;

public sealed class FindTagsByObrigacaoQueryHandler : IRequestHandler<FindTagsByObrigacaoQuery, IList<TagModel>>
{
    private readonly ITagRepository _repository;

    public FindTagsByObrigacaoQueryHandler(ITagRepository repository) => _repository = repository;

    public async Task<IList<TagModel>> Handle(FindTagsByObrigacaoQuery query, CancellationToken cancellationToken)
        => await _repository.FindByObrigacaoAsync(query.ObrigacaoId);
}

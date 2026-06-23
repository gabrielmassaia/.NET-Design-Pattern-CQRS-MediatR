using MediatR;
using PainelObrigacoes.Domain.Tags.Models;
using PainelObrigacoes.Domain.Tags.Queries;
using PainelObrigacoes.Domain.Tags.Repositories;

namespace PainelObrigacoes.Domain.Tags.QueryHandlers;

public sealed class FindTagsQueryHandler : IRequestHandler<FindTagsQuery, IList<TagModel>>
{
    private readonly ITagRepository _repository;

    public FindTagsQueryHandler(ITagRepository repository) => _repository = repository;

    public async Task<IList<TagModel>> Handle(FindTagsQuery query, CancellationToken cancellationToken)
        => await _repository.FindAllAsync();
}

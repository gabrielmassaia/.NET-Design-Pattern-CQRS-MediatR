using MediatR;
using CleanArchReference.Domain.Tags.Models;
using CleanArchReference.Domain.Tags.Queries;
using CleanArchReference.Domain.Tags.Repositories;

namespace CleanArchReference.Domain.Tags.QueryHandlers;

public sealed class FindTagsByObrigacaoQueryHandler : IRequestHandler<FindTagsByObrigacaoQuery, IList<TagModel>>
{
    private readonly ITagRepository _repository;

    public FindTagsByObrigacaoQueryHandler(ITagRepository repository) => _repository = repository;

    public async Task<IList<TagModel>> Handle(FindTagsByObrigacaoQuery query, CancellationToken cancellationToken)
        => await _repository.FindByObrigacaoAsync(query.ObrigacaoId);
}

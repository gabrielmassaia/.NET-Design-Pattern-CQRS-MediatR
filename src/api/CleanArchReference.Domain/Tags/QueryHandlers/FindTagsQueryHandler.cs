using MediatR;
using CleanArchReference.Domain.Tags.Models;
using CleanArchReference.Domain.Tags.Queries;
using CleanArchReference.Domain.Tags.Repositories;

namespace CleanArchReference.Domain.Tags.QueryHandlers;

public sealed class FindTagsQueryHandler : IRequestHandler<FindTagsQuery, IList<TagModel>>
{
    private readonly ITagRepository _repository;

    public FindTagsQueryHandler(ITagRepository repository) => _repository = repository;

    public async Task<IList<TagModel>> Handle(FindTagsQuery query, CancellationToken cancellationToken)
        => await _repository.FindAllAsync();
}

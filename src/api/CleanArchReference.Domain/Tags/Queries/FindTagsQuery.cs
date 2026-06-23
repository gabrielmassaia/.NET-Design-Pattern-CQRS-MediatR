using CleanArchReference.Domain.Shared.Queries;
using CleanArchReference.Domain.Tags.Models;

namespace CleanArchReference.Domain.Tags.Queries;

public sealed class FindTagsQuery : Query<IList<TagModel>>
{
}

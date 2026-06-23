using CleanArchReference.Domain.Shared.Commands;

namespace CleanArchReference.Domain.Tags.Commands;

public sealed class DeleteTagCommand : Command<bool>
{
    public Guid Id { get; set; }
}

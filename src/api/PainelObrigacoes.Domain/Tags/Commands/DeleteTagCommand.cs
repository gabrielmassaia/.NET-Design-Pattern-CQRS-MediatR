using PainelObrigacoes.Domain.Shared.Commands;

namespace PainelObrigacoes.Domain.Tags.Commands;

public sealed class DeleteTagCommand : Command<bool>
{
    public Guid Id { get; set; }
}

using PainelObrigacoes.Domain.Shared.Commands;
using PainelObrigacoes.Domain.Tags.Models;

namespace PainelObrigacoes.Domain.Tags.Commands;

public sealed class CreateTagCommand : Command<TagModel>
{
    public string Nome { get; set; } = string.Empty;
    public string Cor { get; set; } = string.Empty;

    public TagModel ToModel() => new()
    {
        Nome = Nome.Trim(),
        Cor = Cor.Trim()
    };
}

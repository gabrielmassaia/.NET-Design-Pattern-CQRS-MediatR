using PainelObrigacoes.Domain.Shared.Commands;

namespace PainelObrigacoes.Domain.Empresas.Commands;

public sealed class DeleteEmpresaCommand : Command<bool>
{
    public Guid Id { get; set; }
}

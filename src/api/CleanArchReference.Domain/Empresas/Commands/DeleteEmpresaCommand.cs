using CleanArchReference.Domain.Shared.Commands;

namespace CleanArchReference.Domain.Empresas.Commands;

public sealed class DeleteEmpresaCommand : Command<bool>
{
    public Guid Id { get; set; }
}

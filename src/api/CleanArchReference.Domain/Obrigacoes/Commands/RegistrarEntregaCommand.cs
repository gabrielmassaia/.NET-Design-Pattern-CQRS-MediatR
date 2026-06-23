using CleanArchReference.Domain.Obrigacoes.Models;
using CleanArchReference.Domain.Shared.Commands;

namespace CleanArchReference.Domain.Obrigacoes.Commands;

public sealed class RegistrarEntregaCommand : Command<ObrigacaoModel>
{
    public Guid Id { get; set; }
    public DateTime? DataEntrega { get; set; }
}

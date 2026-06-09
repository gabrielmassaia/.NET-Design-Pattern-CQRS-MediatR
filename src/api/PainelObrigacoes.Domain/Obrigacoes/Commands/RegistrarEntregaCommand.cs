using PainelObrigacoes.Domain.Obrigacoes.Models;
using PainelObrigacoes.Domain.Shared.Commands;

namespace PainelObrigacoes.Domain.Obrigacoes.Commands;

public sealed class RegistrarEntregaCommand : Command<ObrigacaoModel>
{
    public Guid Id { get; set; }
    public DateTime? DataEntrega { get; set; }
}

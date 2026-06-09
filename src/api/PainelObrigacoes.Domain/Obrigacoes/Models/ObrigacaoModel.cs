using PainelObrigacoes.Domain.Enums;
using PainelObrigacoes.Domain.Shared.Models;

namespace PainelObrigacoes.Domain.Obrigacoes.Models;

public sealed class ObrigacaoModel : ModelBase
{
    public Guid EmpresaId { get; set; }
    public TipoObrigacao Tipo { get; set; }
    public DateTime Competencia { get; set; }
    public DateTime DataVencimento { get; set; }
    public DateTime? DataEntrega { get; set; }
    public StatusObrigacao Status { get; set; }
}

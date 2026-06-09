using PainelObrigacoes.Domain.Enums;

namespace PainelObrigacoes.Domain.Obrigacoes.Models;

public sealed class ObrigacaoReadModel
{
    public Guid Id { get; set; }
    public Guid EmpresaId { get; set; }
    public string RazaoSocial { get; set; } = string.Empty;
    public TipoObrigacao Tipo { get; set; }
    public string TipoNome => Tipo.ToString().Replace("_", "-");
    public DateTime Competencia { get; set; }
    public DateTime DataVencimento { get; set; }
    public DateTime? DataEntrega { get; set; }
    public StatusObrigacao Status { get; set; }
}

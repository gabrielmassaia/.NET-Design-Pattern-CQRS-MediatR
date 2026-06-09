using PainelObrigacoes.Domain.Enums;

namespace PainelObrigacoes.Application.Dashboard.ViewModels;

public sealed class AlertaResultViewModel
{
    public Guid Id { get; set; }
    public Guid EmpresaId { get; set; }
    public string RazaoSocial { get; set; } = string.Empty;
    public string CNPJ { get; set; } = string.Empty;
    public string TipoNome { get; set; } = string.Empty;
    public DateTime DataVencimento { get; set; }
    public int DiasRestantes { get; set; }
    public StatusObrigacao Status { get; set; }
}

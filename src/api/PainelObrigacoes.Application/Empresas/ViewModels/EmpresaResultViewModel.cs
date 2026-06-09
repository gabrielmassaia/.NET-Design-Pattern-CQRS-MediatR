using PainelObrigacoes.Domain.Enums;

namespace PainelObrigacoes.Application.Empresas.ViewModels;

public sealed class EmpresaResultViewModel
{
    public Guid Id { get; set; }
    public string CNPJ { get; set; } = string.Empty;
    public string RazaoSocial { get; set; } = string.Empty;
    public RegimeTributario Regime { get; set; }
    public DateTime CreatedAt { get; set; }
}

using PainelObrigacoes.Domain.Enums;

namespace PainelObrigacoes.Application.Empresas.ViewModels;

public sealed class CreateEmpresaViewModel
{
    public string CNPJ { get; set; } = string.Empty;
    public string RazaoSocial { get; set; } = string.Empty;
    public RegimeTributario Regime { get; set; }
}

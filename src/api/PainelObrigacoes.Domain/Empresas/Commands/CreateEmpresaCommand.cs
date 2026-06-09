using PainelObrigacoes.Domain.Enums;
using PainelObrigacoes.Domain.Empresas.Models;
using PainelObrigacoes.Domain.Shared.Commands;

namespace PainelObrigacoes.Domain.Empresas.Commands;

public sealed class CreateEmpresaCommand : Command<EmpresaModel>
{
    public string CNPJ { get; set; } = string.Empty;
    public string RazaoSocial { get; set; } = string.Empty;
    public RegimeTributario Regime { get; set; }

    public EmpresaModel ToModel() => new()
    {
        CNPJ = CNPJ.Replace(".", "").Replace("/", "").Replace("-", ""),
        RazaoSocial = RazaoSocial.Trim(),
        Regime = Regime
    };
}

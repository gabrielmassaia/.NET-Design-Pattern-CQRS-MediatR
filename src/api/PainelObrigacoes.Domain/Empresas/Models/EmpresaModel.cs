using PainelObrigacoes.Domain.Enums;
using PainelObrigacoes.Domain.Shared.Models;

namespace PainelObrigacoes.Domain.Empresas.Models;

public sealed class EmpresaModel : ModelBase
{
    public string CNPJ { get; set; } = string.Empty;
    public string RazaoSocial { get; set; } = string.Empty;
    public RegimeTributario Regime { get; set; }
}

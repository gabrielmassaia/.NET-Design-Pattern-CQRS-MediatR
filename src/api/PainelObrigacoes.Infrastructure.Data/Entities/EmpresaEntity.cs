using PainelObrigacoes.Domain.Enums;

namespace PainelObrigacoes.Infrastructure.Data.Entities;

public sealed class EmpresaEntity : EntityBase
{
    public string CNPJ { get; set; } = string.Empty;
    public string RazaoSocial { get; set; } = string.Empty;
    public RegimeTributario Regime { get; set; }
    public ICollection<ObrigacaoEntity> Obrigacoes { get; set; } = [];
}

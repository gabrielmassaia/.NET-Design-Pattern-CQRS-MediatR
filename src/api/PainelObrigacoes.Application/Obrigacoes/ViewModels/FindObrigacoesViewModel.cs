using System.ComponentModel.DataAnnotations;

namespace PainelObrigacoes.Application.Obrigacoes.ViewModels;

public sealed class FindObrigacoesViewModel
{
    public Guid EmpresaId { get; set; }

    [Range(2000, 2100)]
    public int Ano { get; set; }

    [Range(1, 12)]
    public int Mes { get; set; }

    [Range(0, 10_000)]
    public int Skip { get; set; }

    [Range(1, 500)]
    public int Take { get; set; } = 100;
}

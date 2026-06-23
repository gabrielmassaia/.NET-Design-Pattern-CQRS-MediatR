using CleanArchReference.Domain.Enums;

namespace CleanArchReference.Application.Obrigacoes.ViewModels;

public sealed class ObrigacaoResultViewModel
{
    public Guid Id { get; set; }
    public Guid EmpresaId { get; set; }
    public string RazaoSocial { get; set; } = string.Empty;
    public TipoObrigacao Tipo { get; set; }
    public string TipoNome { get; set; } = string.Empty;
    public DateTime Competencia { get; set; }
    public DateTime DataVencimento { get; set; }
    public DateTime? DataEntrega { get; set; }
    public StatusObrigacao Status { get; set; }
}

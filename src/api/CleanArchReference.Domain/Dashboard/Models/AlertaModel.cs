using CleanArchReference.Domain.Enums;

namespace CleanArchReference.Domain.Dashboard.Models;

public sealed class AlertaModel
{
    public Guid Id { get; set; }
    public Guid EmpresaId { get; set; }
    public string RazaoSocial { get; set; } = string.Empty;
    public string CNPJ { get; set; } = string.Empty;
    public TipoObrigacao Tipo { get; set; }
    public string TipoNome => Tipo.ToString().Replace("_", "-");
    public DateTime DataVencimento { get; set; }
    public int DiasRestantes { get; set; }
    public StatusObrigacao Status { get; set; }
}

using PainelObrigacoes.Domain.Enums;

namespace PainelObrigacoes.Infrastructure.Data.Entities;

public sealed class ObrigacaoEntity : EntityBase
{
    public Guid EmpresaId { get; set; }
    public EmpresaEntity Empresa { get; set; } = null!;
    public TipoObrigacao Tipo { get; set; }
    public DateTime Competencia { get; set; }
    public DateTime DataVencimento { get; set; }
    public DateTime? DataEntrega { get; set; }
    public StatusObrigacao Status { get; set; } = StatusObrigacao.Pendente;
    public byte[] RowVersion { get; set; } = [];
    public ICollection<ObrigacaoTagEntity> Tags { get; set; } = [];
}

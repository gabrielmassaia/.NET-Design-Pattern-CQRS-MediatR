namespace CleanArchReference.Infrastructure.Data.Entities;

public sealed class ObrigacaoTagEntity
{
    public Guid ObrigacaoId { get; set; }
    public ObrigacaoEntity Obrigacao { get; set; } = null!;
    public Guid TagId { get; set; }
    public TagEntity Tag { get; set; } = null!;
}

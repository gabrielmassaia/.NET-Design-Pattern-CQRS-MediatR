namespace CleanArchReference.Infrastructure.Data.Entities;

public sealed class TagEntity : EntityBase
{
    public string Nome { get; set; } = string.Empty;
    public string Cor { get; set; } = string.Empty;
    public ICollection<ObrigacaoTagEntity> Obrigacoes { get; set; } = [];
}

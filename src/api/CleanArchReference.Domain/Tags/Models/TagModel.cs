using CleanArchReference.Domain.Shared.Models;

namespace CleanArchReference.Domain.Tags.Models;

public sealed class TagModel : ModelBase
{
    public string Nome { get; set; } = string.Empty;
    public string Cor { get; set; } = string.Empty;
}

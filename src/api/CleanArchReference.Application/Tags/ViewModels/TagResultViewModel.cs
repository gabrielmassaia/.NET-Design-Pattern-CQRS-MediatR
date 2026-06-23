namespace CleanArchReference.Application.Tags.ViewModels;

public sealed class TagResultViewModel
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Cor { get; set; } = string.Empty;
}

using System.ComponentModel.DataAnnotations;

namespace CleanArchReference.Application.Tags.ViewModels;

public sealed class VincularTagsViewModel
{
    [Required(ErrorMessage = "Lista de tags é obrigatória.")]
    public List<Guid> TagIds { get; set; } = [];
}

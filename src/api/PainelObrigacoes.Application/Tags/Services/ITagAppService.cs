using PainelObrigacoes.Application.Obrigacoes.ViewModels;
using PainelObrigacoes.Application.Tags.ViewModels;

namespace PainelObrigacoes.Application.Tags.Services;

public interface ITagAppService
{
    Task<IList<TagResultViewModel>> FindAllAsync(CancellationToken ct = default);
    Task<TagResultViewModel> CreateAsync(CreateTagViewModel viewModel, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
    Task<ObrigacaoResultViewModel> VincularTagsAsync(Guid obrigacaoId, VincularTagsViewModel viewModel, CancellationToken ct = default);
    Task<IList<TagResultViewModel>> FindByObrigacaoAsync(Guid obrigacaoId, CancellationToken ct = default);
}

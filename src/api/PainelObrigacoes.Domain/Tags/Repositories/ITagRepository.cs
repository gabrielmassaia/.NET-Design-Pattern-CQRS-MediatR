using PainelObrigacoes.Domain.Tags.Models;

namespace PainelObrigacoes.Domain.Tags.Repositories;

public interface ITagRepository
{
    Task<IList<TagModel>> FindAllAsync();
    Task<TagModel?> FindByIdAsync(Guid id);
    Task<IList<TagModel>> FindByObrigacaoAsync(Guid obrigacaoId);
    void Create(TagModel model);
    void Update(TagModel model);
    void Delete(TagModel model);
}

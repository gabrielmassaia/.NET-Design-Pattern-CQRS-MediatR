using Microsoft.EntityFrameworkCore;
using PainelObrigacoes.Domain.Tags.Models;
using PainelObrigacoes.Domain.Tags.Repositories;
using PainelObrigacoes.Infrastructure.Data.Context;
using PainelObrigacoes.Infrastructure.Data.Entities;

namespace PainelObrigacoes.Infrastructure.Data.Tags.Repositories;

public sealed class TagRepository : ITagRepository
{
    private readonly AppDbContext _context;

    public TagRepository(AppDbContext context)
    {
        ArgumentNullException.ThrowIfNull(context);
        _context = context;
    }

    public async Task<IList<TagModel>> FindAllAsync()
    {
        return await _context.Tags.AsNoTracking()
            .OrderBy(t => t.Nome)
            .Select(t => ToModel(t))
            .ToListAsync();
    }

    public async Task<TagModel?> FindByIdAsync(Guid id)
    {
        var entity = await _context.Tags.AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id);
        return entity is null ? null : ToModel(entity);
    }

    public async Task<IList<TagModel>> FindByObrigacaoAsync(Guid obrigacaoId)
    {
        return await _context.Set<ObrigacaoTagEntity>()
            .AsNoTracking()
            .Where(ot => ot.ObrigacaoId == obrigacaoId)
            .Select(ot => ToModel(ot.Tag))
            .ToListAsync();
    }

    public void Create(TagModel model)
        => _context.Tags.Add(ToEntity(model));

    public void Update(TagModel model)
    {
        var tracked = _context.Tags.Local.FirstOrDefault(t => t.Id == model.Id);
        if (tracked is null)
            _context.Tags.Update(ToEntity(model));
        else
        {
            tracked.Nome = model.Nome;
            tracked.Cor = model.Cor;
            tracked.UpdatedAt = model.UpdatedAt;
        }
    }

    public void Delete(TagModel model)
    {
        var tracked = _context.Tags.Local.FirstOrDefault(t => t.Id == model.Id);
        if (tracked is null)
        {
            tracked = ToEntity(model);
            _context.Tags.Attach(tracked);
        }
        tracked.IsActive = false;
        tracked.UpdatedAt = DateTime.UtcNow;
    }

    private static TagModel ToModel(TagEntity t) => new()
    {
        Id = t.Id,
        Nome = t.Nome,
        Cor = t.Cor,
        CreatedAt = t.CreatedAt,
        UpdatedAt = t.UpdatedAt
    };

    private static TagEntity ToEntity(TagModel m) => new()
    {
        Id = m.Id,
        Nome = m.Nome,
        Cor = m.Cor,
        CreatedAt = m.CreatedAt,
        UpdatedAt = m.UpdatedAt
    };
}

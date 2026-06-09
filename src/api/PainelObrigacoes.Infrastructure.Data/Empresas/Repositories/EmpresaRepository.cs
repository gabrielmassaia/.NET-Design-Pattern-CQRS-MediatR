using Microsoft.EntityFrameworkCore;
using PainelObrigacoes.Domain.Empresas.Models;
using PainelObrigacoes.Domain.Empresas.Repositories;
using PainelObrigacoes.Infrastructure.Data.Context;
using PainelObrigacoes.Infrastructure.Data.Entities;

namespace PainelObrigacoes.Infrastructure.Data.Empresas.Repositories;

public sealed class EmpresaRepository : IEmpresaRepository
{
    private readonly AppDbContext _context;

    public EmpresaRepository(AppDbContext context)
    {
        ArgumentNullException.ThrowIfNull(context);
        _context = context;
    }

    public async Task<EmpresaModel?> FindByIdAsync(Guid id)
    {
        var entity = await _context.Empresas.AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id);
        return entity is null ? null : ToModel(entity);
    }

    public async Task<IList<EmpresaModel>> FindAllAsync(int skip = 0, int take = 50)
    {
        var entities = await _context.Empresas.AsNoTracking()
            .OrderBy(e => e.RazaoSocial)
            .Skip(skip).Take(take)
            .ToListAsync();
        return entities.Select(ToModel).ToList();
    }

    public Task<bool> ExistsByCnpjAsync(string cnpj)
        => _context.Empresas.AnyAsync(e => e.CNPJ == cnpj);

    public void Create(EmpresaModel model)
    {
        ArgumentNullException.ThrowIfNull(model);
        var entity = ToEntity(model);
        _context.Empresas.Add(entity);
        model.Id = entity.Id;
    }

    public void Delete(EmpresaModel model)
    {
        var entity = _context.Empresas.IgnoreQueryFilters()
            .FirstOrDefault(e => e.Id == model.Id);

        if (entity is not null)
        {
            entity.IsActive = false;
            entity.UpdatedAt = DateTime.UtcNow;
        }
    }

    private static EmpresaModel ToModel(EmpresaEntity e) => new()
    {
        Id = e.Id,
        CNPJ = e.CNPJ,
        RazaoSocial = e.RazaoSocial,
        Regime = e.Regime,
        CreatedAt = e.CreatedAt,
        UpdatedAt = e.UpdatedAt
    };

    private static EmpresaEntity ToEntity(EmpresaModel m) => new()
    {
        Id = m.Id,
        CNPJ = m.CNPJ,
        RazaoSocial = m.RazaoSocial,
        Regime = m.Regime,
        CreatedAt = m.CreatedAt
    };
}

// ============================================================
// 🟠 FASE 4.1 — Repository (Implementação EF Core)
// ============================================================
//
// Responsabilidade: "Tradutor entre Domain (Model) e Banco (Entity)"
// O que faz:
//   1. Recebe Model (Domain) → converte pra Entity (EF Core)
//   2. Usa EF Core pra ler/escrever no PostgreSQL
//   3. Converte Entity de volta pra Model (Domain)
//
// REGRAS DE OURO REPOSITORY:
//   ❌ NUNCA chama SaveChangesAsync — isso é do UnitOfWork
//   ✅ Só rastreia mudanças no ChangeTracker do EF Core
//   ✅ Só traduz Model ↔ Entity
//
// REGRAS DE OURO CREATE:
//   ❌ Não salva no banco (só faz Add no ChangeTracker)
//   ✅ Sincroniza o Id gerado: model.Id = entity.Id
//   O SaveChanges será chamado pelo Handler via UnitOfWork
//
// FLUXO DE MAPEAMENTO:
//   EmpresaModel (Domain) → ToEntity() → EmpresaEntity (Infra)
//   EmpresaEntity (Infra)  → ToModel() → EmpresaModel (Domain)
// ============================================================

using Microsoft.EntityFrameworkCore;
using CleanArchReference.Domain.Empresas.Models;
using CleanArchReference.Domain.Empresas.Repositories;
using CleanArchReference.Infrastructure.Data.Context;
using CleanArchReference.Infrastructure.Data.Entities;

namespace CleanArchReference.Infrastructure.Data.Empresas.Repositories;

public sealed class EmpresaRepository : IEmpresaRepository
{
    // AppDbContext = EF Core DbContext (configurado em AppDbContext.cs)
    // Injeta o mesmo contexto que o UnitOfWork usa
    // Assim as operações ficam na MESMA transação
    private readonly AppDbContext _context;

    // 🟠 CONSTRUTOR: DI injeta o AppDbContext do EF Core
    // Registrado em: ProjectBootstrapper.cs → AddDbContext<AppDbContext>()
    public EmpresaRepository(AppDbContext context)
    {
        ArgumentNullException.ThrowIfNull(context);
        _context = context;
    }

    // FindByIdAsync: busca uma empresa pelo Id
    // AsNoTracking() = não rastreia mudanças (só leitura, mais rápido)
    public async Task<EmpresaModel?> FindByIdAsync(Guid id)
    {
        var entity = await _context.Empresas.AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id);
        return entity is null ? null : ToModel(entity);
    }

    // FindAllAsync: lista empresas com paginação
    public async Task<IList<EmpresaModel>> FindAllAsync(int skip = 0, int take = 50)
    {
        var entities = await _context.Empresas.AsNoTracking()
            .OrderBy(e => e.RazaoSocial)
            .Skip(skip).Take(take)
            .ToListAsync();
        return entities.Select(ToModel).ToList();
    }

    // ExistsByCnpjAsync: verifica se CNPJ já existe (validação de negócio)
    // Usado pelo Handler pra evitar duplicidade
    public Task<bool> ExistsByCnpjAsync(string cnpj)
        => _context.Empresas.AnyAsync(e => e.CNPJ == cnpj);

    // 🟠 CREATE: AÇÃO PRINCIPAL DO NOSSO FLUXO
    //
    // PASSO A PASSO:
    //   1. Recebe EmpresaModel (Domain) que veio do Handler
    //   2. Converte pra EmpresaEntity (EF Core) via ToEntity()
    //   3. Adiciona no DbSet (ChangeTracker marca como "Added")
    //   4. Sincroniza o Id: o EF gera um Id pra entity, copia pro model
    //
    // IMPORTANTE: NÃO chama SaveChanges aqui!
    //   O SaveChanges só acontece no UnitOfWork.CompleteAsync()
    //   que é chamado pelo Handler DEPOIS de todas as operações
    //
    // Por que não salvar aqui?
    //   - Se salvasse aqui, a empresa iria pro banco ANTES das obrigações
    //   - Se a geração de obrigações falhasse → empresa sem obrigações no banco
    //   - Com o UnitOfWork: TUDO vai junto ou NADA vai (transação atômica)
    public void Create(EmpresaModel model)
    {
        ArgumentNullException.ThrowIfNull(model);
        var entity = ToEntity(model);     // Model (Domain) → Entity (EF Core)
        _context.Empresas.Add(entity);    // Marca como "Added" no ChangeTracker
        model.Id = entity.Id;             // Copia o Id gerado de volta pro Model
    }

    // Delete: soft delete (marca IsActive = false)
    // O filtro global (HasQueryFilter) esconde registros inativos
    // IgnoreQueryFilters() = preciso pra encontrar um registro já "deletado"
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

    // 🟠 ToModel: Entity (EF Core) → Model (Domain)
    // Usado nas operações de LEITURA (FindById, FindAll)
    private static EmpresaModel ToModel(EmpresaEntity e) => new()
    {
        Id = e.Id,
        CNPJ = e.CNPJ,
        RazaoSocial = e.RazaoSocial,
        Regime = e.Regime,
        CreatedAt = e.CreatedAt,
        UpdatedAt = e.UpdatedAt
    };

    // 🟠 ToEntity: Model (Domain) → Entity (EF Core)
    // Usado nas operações de ESCRITA (Create)
    private static EmpresaEntity ToEntity(EmpresaModel m) => new()
    {
        Id = m.Id,
        CNPJ = m.CNPJ,
        RazaoSocial = m.RazaoSocial,
        Regime = m.Regime,
        CreatedAt = m.CreatedAt
    };
}

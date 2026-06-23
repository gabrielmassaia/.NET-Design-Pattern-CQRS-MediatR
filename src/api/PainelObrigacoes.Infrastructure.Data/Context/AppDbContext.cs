using Microsoft.EntityFrameworkCore;
using PainelObrigacoes.Infrastructure.Data.Entities;

namespace PainelObrigacoes.Infrastructure.Data.Context;

public sealed class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<EmpresaEntity> Empresas => Set<EmpresaEntity>();
    public DbSet<ObrigacaoEntity> Obrigacoes => Set<ObrigacaoEntity>();
    public DbSet<TagEntity> Tags => Set<TagEntity>();
    public DbSet<ObrigacaoTagEntity> ObrigacaoTags => Set<ObrigacaoTagEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
        => modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
}

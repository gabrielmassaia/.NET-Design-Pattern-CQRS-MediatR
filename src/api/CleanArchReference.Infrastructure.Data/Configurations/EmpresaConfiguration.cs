// ============================================================
// 🟠 FASE 4 — EmpresaConfiguration (Mapeamento da Tabela)
// ============================================================
//
// Responsabilidade: "Configura como a tabela Empresas é mapeada no banco"
//
// Fluent API do EF Core: define detalhes que não dá pra colocar com Data Annotations
// É carregado automaticamente pelo AppDbContext.OnModelCreating():
//   modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly)
//
// CONFIGURAÇÕES:
//   ToTable("Empresas")      → nome da tabela no PostgreSQL
//   HasKey(e => e.Id)        → chave primária
//   HasMaxLength(14)         → CNPJ tem no máximo 14 dígitos
//   HasIndex().IsUnique()    → índice único pra garantir CNPJ não duplicado
//   HasQueryFilter(e => e.IsActive) → soft delete automático
//   HasMany()...Cascade      → deletar empresa deleta obrigações em cascata
// ============================================================

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CleanArchReference.Infrastructure.Data.Entities;

namespace CleanArchReference.Infrastructure.Data.Configurations;

// IEntityTypeConfiguration<EmpresaEntity>: interface do EF Core pra configurar uma entidade
public sealed class EmpresaConfiguration : IEntityTypeConfiguration<EmpresaEntity>
{
    public void Configure(EntityTypeBuilder<EmpresaEntity> builder)
    {
        // Nome da tabela no banco
        builder.ToTable("Empresas");

        // Chave primária: Id (Guid)
        builder.HasKey(e => e.Id);

        // CNPJ: string de até 14 caracteres, obrigatório, índice único
        builder.Property(e => e.CNPJ).HasMaxLength(14).IsRequired();
        builder.HasIndex(e => e.CNPJ).IsUnique(); // ← garante CNPJ único no banco

        // Razão Social: string de até 300 caracteres, obrigatório
        builder.Property(e => e.RazaoSocial).HasMaxLength(300).IsRequired();

        // Regime Tributário: obrigatório (armazenado como int do enum)
        builder.Property(e => e.Regime).IsRequired();

        // 🔴 Filtro global de soft delete
        // Toda query que fizer "SELECT * FROM Empresas" vai ter automaticamente
        // "WHERE IsActive = true" adicionado pelo EF Core
        // Pra consultar inativos: .IgnoreQueryFilters()
        builder.HasQueryFilter(e => e.IsActive);

        // Relacionamento 1:N: Empresa → Obrigações
        // Uma empresa tem MUITAS obrigações
        // Quando a empresa for deletada (soft), as obrigações também são
        builder.HasMany(e => e.Obrigacoes)
               .WithOne(o => o.Empresa)
               .HasForeignKey(o => o.EmpresaId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}

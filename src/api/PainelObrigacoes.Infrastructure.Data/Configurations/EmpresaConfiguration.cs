using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PainelObrigacoes.Infrastructure.Data.Entities;

namespace PainelObrigacoes.Infrastructure.Data.Configurations;

public sealed class EmpresaConfiguration : IEntityTypeConfiguration<EmpresaEntity>
{
    public void Configure(EntityTypeBuilder<EmpresaEntity> builder)
    {
        builder.ToTable("Empresas");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.CNPJ).HasMaxLength(14).IsRequired();
        builder.HasIndex(e => e.CNPJ).IsUnique();
        builder.Property(e => e.RazaoSocial).HasMaxLength(300).IsRequired();
        builder.Property(e => e.Regime).IsRequired();
        builder.HasQueryFilter(e => e.IsActive);

        builder.HasMany(e => e.Obrigacoes)
               .WithOne(o => o.Empresa)
               .HasForeignKey(o => o.EmpresaId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}

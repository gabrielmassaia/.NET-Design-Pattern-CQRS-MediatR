using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PainelObrigacoes.Infrastructure.Data.Entities;

namespace PainelObrigacoes.Infrastructure.Data.Configurations;

public sealed class ObrigacaoConfiguration : IEntityTypeConfiguration<ObrigacaoEntity>
{
    public void Configure(EntityTypeBuilder<ObrigacaoEntity> builder)
    {
        builder.ToTable("Obrigacoes");
        builder.HasKey(o => o.Id);
        builder.Property(o => o.Tipo).IsRequired();
        builder.Property(o => o.Competencia).IsRequired();
        builder.Property(o => o.DataVencimento).IsRequired();
        builder.Property(o => o.Status).IsRequired();

        builder.HasIndex(o => new { o.EmpresaId, o.Competencia });
        builder.HasIndex(o => o.DataVencimento);
        builder.HasQueryFilter(o => o.Empresa.IsActive);

        builder.Property(o => o.RowVersion)
            .IsRowVersion();
    }
}

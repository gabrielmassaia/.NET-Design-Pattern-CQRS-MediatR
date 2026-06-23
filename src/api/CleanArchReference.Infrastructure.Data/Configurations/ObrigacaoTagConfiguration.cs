using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CleanArchReference.Infrastructure.Data.Entities;

namespace CleanArchReference.Infrastructure.Data.Configurations;

public sealed class ObrigacaoTagConfiguration : IEntityTypeConfiguration<ObrigacaoTagEntity>
{
    public void Configure(EntityTypeBuilder<ObrigacaoTagEntity> builder)
    {
        builder.ToTable("ObrigacaoTags");
        builder.HasKey(ot => new { ot.ObrigacaoId, ot.TagId });

        builder.HasOne(ot => ot.Obrigacao)
               .WithMany(o => o.Tags)
               .HasForeignKey(ot => ot.ObrigacaoId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ot => ot.Tag)
               .WithMany(t => t.Obrigacoes)
               .HasForeignKey(ot => ot.TagId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}

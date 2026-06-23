using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PainelObrigacoes.Infrastructure.Data.Entities;

namespace PainelObrigacoes.Infrastructure.Data.Configurations;

public sealed class TagConfiguration : IEntityTypeConfiguration<TagEntity>
{
    public void Configure(EntityTypeBuilder<TagEntity> builder)
    {
        builder.ToTable("Tags");
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Nome).HasMaxLength(50).IsRequired();
        builder.Property(t => t.Cor).HasMaxLength(9).IsRequired();
        builder.HasIndex(t => t.Nome);
        builder.HasQueryFilter(t => t.IsActive);

        builder.HasMany(t => t.Obrigacoes)
               .WithOne(ot => ot.Tag)
               .HasForeignKey(ot => ot.TagId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}

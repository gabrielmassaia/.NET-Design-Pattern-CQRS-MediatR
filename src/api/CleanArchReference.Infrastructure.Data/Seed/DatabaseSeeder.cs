using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using CleanArchReference.Domain.Empresas.Models;
using CleanArchReference.Domain.Empresas.Services;
using CleanArchReference.Domain.Enums;
using CleanArchReference.Domain.Obrigacoes.Services;
using CleanArchReference.Infrastructure.Data.Context;
using CleanArchReference.Infrastructure.Data.Entities;

namespace CleanArchReference.Infrastructure.Data.Seed;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var context = services.GetRequiredService<AppDbContext>();
        var engine  = services.GetRequiredService<ITributaryRulesEngine>();
        var search  = services.GetRequiredService<IEmpresaSearchService>();

        if (!await context.Empresas.IgnoreQueryFilters().AnyAsync())
        {
            var anoAtual = DateTime.UtcNow.Year;

            var seeds = new[]
            {
                (CNPJ: "11222333000181", Nome: "Padaria São João Ltda",         Regime: RegimeTributario.SimplesNacional),
                (CNPJ: "22333444000172", Nome: "Consultoria Fiscal Omega S.A.", Regime: RegimeTributario.LucroPresumido),
                (CNPJ: "33444555000163", Nome: "Banco Meridional S.A.",         Regime: RegimeTributario.LucroReal),
                (CNPJ: "44555666000154", Nome: "Instituto Educar Brasil",       Regime: RegimeTributario.ImunidadeIsencao),
            };

            foreach (var seed in seeds)
            {
                var entity = new EmpresaEntity
                {
                    CNPJ = seed.CNPJ,
                    RazaoSocial = seed.Nome,
                    Regime = seed.Regime
                };

                await context.Empresas.AddAsync(entity);
                await context.SaveChangesAsync();

                var model = new EmpresaModel
                {
                    Id = entity.Id,
                    CNPJ = entity.CNPJ,
                    RazaoSocial = entity.RazaoSocial,
                    Regime = entity.Regime
                };

                await search.IndexAsync(model, CancellationToken.None);

                var obrigacoes = engine.GenerateAnoCompleto(model, anoAtual).ToList();

                foreach (var o in obrigacoes.Where(o => o.DataVencimento < DateTime.UtcNow)
                                            .OrderBy(o => o.DataVencimento).Take(3))
                {
                    o.DataEntrega = o.DataVencimento.AddDays(-1);
                    o.Status = StatusObrigacao.Entregue;
                }

                await context.Obrigacoes.AddRangeAsync(obrigacoes.Select(o => new ObrigacaoEntity
                {
                    Id = o.Id,
                    EmpresaId = entity.Id,
                    Tipo = o.Tipo,
                    Competencia = o.Competencia,
                    DataVencimento = o.DataVencimento,
                    DataEntrega = o.DataEntrega,
                    Status = o.Status
                }));

                await context.SaveChangesAsync();
            }
        }
        else
        {
            await SyncSearchIndexAsync(context, search);
        }
    }

    public static async Task SyncSearchIndexAsync(AppDbContext context, IEmpresaSearchService search)
    {
        var empresas = await context.Empresas.IgnoreQueryFilters().AsNoTracking().ToListAsync();

        foreach (var entity in empresas)
        {
            var model = new EmpresaModel
            {
                Id = entity.Id,
                CNPJ = entity.CNPJ,
                RazaoSocial = entity.RazaoSocial,
                Regime = entity.Regime,
                CreatedAt = entity.CreatedAt
            };

            await search.IndexAsync(model, CancellationToken.None);
        }
    }
}

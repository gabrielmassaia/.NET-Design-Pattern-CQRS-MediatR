using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using PainelObrigacoes.Domain.Empresas.Models;
using PainelObrigacoes.Domain.Empresas.Services;
using PainelObrigacoes.Infrastructure.Data.Context;
using PainelObrigacoes.Infrastructure.Data.Search;

namespace PainelObrigacoes.IntegrationTests;

public class TestWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Test");

        builder.ConfigureTestServices(services =>
        {
            // Remove DbContextOptions<AppDbContext> e IDbContextOptionsConfiguration<AppDbContext>
            // (onde o Npgsql registra sua lambda de configuração) para evitar dual-provider error
            var toRemove = services
                .Where(d =>
                    d.ServiceType == typeof(DbContextOptions<AppDbContext>) ||
                    d.ServiceType == typeof(IDbContextOptionsConfiguration<AppDbContext>))
                .ToList();
            foreach (var d in toRemove)
                services.Remove(d);

            // Captura o nome ANTES do lambda para garantir que todas as instâncias
            // de AppDbContext compartilhem o mesmo banco InMemory durante os testes
            var dbName = $"TestDb_{Guid.NewGuid()}";
            services.AddDbContext<AppDbContext>(options =>
                options.UseInMemoryDatabase(dbName));

            // Replace Redis with in-memory distributed cache
            services.RemoveAll<Microsoft.Extensions.Caching.Distributed.IDistributedCache>();
            services.AddDistributedMemoryCache();

            // Remove Meilisearch hosted service — it tries to connect at startup
            var meiliSetup = services.FirstOrDefault(d => d.ServiceType == typeof(IHostedService)
                && d.ImplementationType == typeof(MeilisearchIndexSetup));
            if (meiliSetup is not null)
                services.Remove(meiliSetup);

            // Replace Meilisearch with no-op stub to avoid connection errors
            services.RemoveAll<IEmpresaSearchService>();
            services.AddScoped<IEmpresaSearchService, NoOpEmpresaSearchService>();
        });
    }
}

/// <summary>No-op search service for integration tests — avoids real Meilisearch calls.</summary>
file sealed class NoOpEmpresaSearchService : IEmpresaSearchService
{
    public Task IndexAsync(EmpresaModel empresa, CancellationToken ct = default)
        => Task.CompletedTask;

    public Task DeleteFromIndexAsync(Guid id, CancellationToken ct = default)
        => Task.CompletedTask;

    public Task<IList<EmpresaModel>> SearchAsync(string query, CancellationToken ct = default)
        => Task.FromResult<IList<EmpresaModel>>(new List<EmpresaModel>());
}

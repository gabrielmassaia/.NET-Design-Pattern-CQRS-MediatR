using Meilisearch;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace CleanArchReference.Infrastructure.Data.Search;

public sealed class MeilisearchIndexSetup : IHostedService
{
    private readonly IServiceProvider _services;

    public MeilisearchIndexSetup(IServiceProvider services) => _services = services;

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = _services.CreateScope();
        var client = scope.ServiceProvider.GetRequiredService<MeilisearchClient>();
        var index = client.Index("empresas");

        await index.UpdateSearchableAttributesAsync(
            ["razaoSocial", "cnpj"], cancellationToken);

        await index.UpdateFilterableAttributesAsync(
            ["regime"], cancellationToken);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}

using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using PainelObrigacoes.Domain.Empresas.Repositories;
using PainelObrigacoes.Domain.Obrigacoes.Repositories;
using PainelObrigacoes.Domain.Obrigacoes.Services;
using PainelObrigacoes.Domain.Shared.Interfaces;

namespace PainelObrigacoes.Infrastructure.Data.Services;

public sealed class YearRolloverService : IHostedService, IDisposable
{
    private readonly IServiceScopeFactory _scopeFactory;
    private Timer? _timer;

    public YearRolloverService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        await ProcessRolloverAsync();

        _timer = new Timer(async _ => await ProcessRolloverAsync(),
            null, TimeSpan.FromHours(24), TimeSpan.FromHours(24));
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _timer?.Change(Timeout.Infinite, 0);
        return Task.CompletedTask;
    }

    public void Dispose() => _timer?.Dispose();

    private async Task ProcessRolloverAsync()
    {
        using var scope = _scopeFactory.CreateScope();
        var clock = scope.ServiceProvider.GetRequiredService<IDateTimeProvider>();
        var empresaRepo = scope.ServiceProvider.GetRequiredService<IEmpresaRepository>();
        var obrigacaoRepo = scope.ServiceProvider.GetRequiredService<IObrigacaoRepository>();
        var engine = scope.ServiceProvider.GetRequiredService<ITributaryRulesEngine>();
        var uow = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

        var ano = clock.CurrentYear;
        var empresas = await empresaRepo.FindAllAsync(0, 10_000);

        foreach (var empresa in empresas)
        {
            var exists = await obrigacaoRepo.HasObrigacoesInYearAsync(empresa.Id, ano);
            if (!exists)
            {
                var obrigacoes = engine.GenerateAnoCompleto(empresa, ano);
                obrigacaoRepo.CreateRange(obrigacoes);
            }
        }

        await uow.CompleteAsync();
    }
}

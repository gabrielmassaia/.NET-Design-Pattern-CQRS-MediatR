using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
using PainelObrigacoes.Application.Dashboard.ViewModels;

namespace PainelObrigacoes.Application.Dashboard.Services;

public sealed class CachedDashboardAppService : IDashboardAppService
{
    private readonly IDashboardAppService _inner;
    private readonly IDistributedCache _cache;

    private static readonly DistributedCacheEntryOptions _dashboardTtl =
        new() { AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30) };
    private static readonly DistributedCacheEntryOptions _alertasTtl =
        new() { AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(60) };

    public CachedDashboardAppService(IDashboardAppService inner, IDistributedCache cache)
    {
        _inner = inner;
        _cache = cache;
    }

    public async Task<DashboardResultViewModel> GetDashboardAsync(CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;
        var key = $"dashboard:{now.Year}:{now.Month}";
        var cached = await _cache.GetStringAsync(key, ct);
        if (cached is not null)
            return JsonSerializer.Deserialize<DashboardResultViewModel>(cached)!;

        var result = await _inner.GetDashboardAsync(ct);
        await _cache.SetStringAsync(key, JsonSerializer.Serialize(result), _dashboardTtl, ct);
        return result;
    }

    public async Task<IList<AlertaResultViewModel>> GetAlertasAsync(CancellationToken ct = default)
    {
        const string key = "alertas:current";
        var cached = await _cache.GetStringAsync(key, ct);
        if (cached is not null)
            return JsonSerializer.Deserialize<IList<AlertaResultViewModel>>(cached)!;

        var result = await _inner.GetAlertasAsync(ct);
        await _cache.SetStringAsync(key, JsonSerializer.Serialize(result), _alertasTtl, ct);
        return result;
    }

    public Task<(byte[] Content, string ContentType, string FileName)> ExportAlertasAsync(
        string formato, CancellationToken ct = default)
        => _inner.ExportAlertasAsync(formato, ct);

    public Task<(byte[] Content, string ContentType, string FileName)> ExportDashboardAsync(
        string formato, CancellationToken ct = default)
        => _inner.ExportDashboardAsync(formato, ct);
}

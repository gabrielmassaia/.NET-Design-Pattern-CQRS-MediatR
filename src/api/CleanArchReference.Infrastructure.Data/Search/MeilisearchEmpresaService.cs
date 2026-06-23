using Meilisearch;
using CleanArchReference.Domain.Empresas.Models;
using CleanArchReference.Domain.Empresas.Services;
using CleanArchReference.Domain.Enums;

namespace CleanArchReference.Infrastructure.Data.Search;

public sealed class MeilisearchEmpresaService : IEmpresaSearchService
{
    private readonly MeilisearchClient _client;
    private const string IndexName = "empresas";

    public MeilisearchEmpresaService(MeilisearchClient client) => _client = client;

    public async Task IndexAsync(EmpresaModel empresa, CancellationToken ct = default)
    {
        var index = _client.Index(IndexName);
        await index.AddDocumentsAsync(new[] { ToDocument(empresa) }, primaryKey: "id", cancellationToken: ct);
    }

    public async Task DeleteFromIndexAsync(Guid id, CancellationToken ct = default)
    {
        var index = _client.Index(IndexName);
        await index.DeleteOneDocumentAsync(id.ToString(), ct);
    }

    public async Task<IList<EmpresaModel>> SearchAsync(string query, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(query))
            return [];

        var index = _client.Index(IndexName);
        var result = await index.SearchAsync<EmpresaDocument>(query, cancellationToken: ct);
        return result.Hits.Select(ToModel).ToList();
    }

    private static EmpresaDocument ToDocument(EmpresaModel m) => new()
    {
        Id = m.Id.ToString(),
        Cnpj = m.CNPJ,
        RazaoSocial = m.RazaoSocial,
        Regime = (int)m.Regime,
        CreatedAt = m.CreatedAt
    };

    private static EmpresaModel ToModel(EmpresaDocument d) => new()
    {
        Id = Guid.Parse(d.Id),
        CNPJ = d.Cnpj,
        RazaoSocial = d.RazaoSocial,
        Regime = (RegimeTributario)d.Regime,
        CreatedAt = d.CreatedAt
    };

    private sealed class EmpresaDocument
    {
        public string Id { get; set; } = string.Empty;
        public string Cnpj { get; set; } = string.Empty;
        public string RazaoSocial { get; set; } = string.Empty;
        public int Regime { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

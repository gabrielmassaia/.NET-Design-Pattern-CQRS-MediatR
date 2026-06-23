using System.Net;
using System.Text;
using FluentAssertions;
using Meilisearch;
using CleanArchReference.Domain.Empresas.Models;
using CleanArchReference.Domain.Enums;
using CleanArchReference.Infrastructure.Data.Search;

namespace CleanArchReference.Tests.Infrastructure.Data.Search;

public class MeilisearchEmpresaServiceTests : IDisposable
{
    private readonly MockHttpMessageHandler _handler = new();
    private readonly HttpClient _httpClient;
    private readonly MeilisearchClient _client;
    private readonly MeilisearchEmpresaService _sut;

    public MeilisearchEmpresaServiceTests()
    {
        _httpClient = new HttpClient(_handler) { BaseAddress = new Uri("http://localhost:7700") };
        _client = new MeilisearchClient(_httpClient, "http://localhost:7700");
        _sut = new MeilisearchEmpresaService(_client);
    }

    public void Dispose()
    {
        _httpClient.Dispose();
        GC.SuppressFinalize(this);
    }

    private static EmpresaModel CreateEmpresa() => new()
    {
        Id = Guid.Parse("a1b2c3d4-1234-5678-9abc-def012345678"),
        CNPJ = "11222333000181",
        RazaoSocial = "Empresa Teste Ltda",
        Regime = RegimeTributario.SimplesNacional,
        CreatedAt = new DateTime(2026, 1, 15, 10, 0, 0, DateTimeKind.Utc),
    };

    [Fact]
    public async Task SearchAsync_QueryVazia_DeveRetornarListaVazia()
    {
        var result = await _sut.SearchAsync("");

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task SearchAsync_QueryNull_DeveRetornarListaVazia()
    {
        var result = await _sut.SearchAsync(null!);

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task SearchAsync_QueryWhitespace_DeveRetornarListaVazia()
    {
        var result = await _sut.SearchAsync("   ");

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task IndexAsync_DeveChamarApiSemErro()
    {
        var empresa = CreateEmpresa();
        _handler.EnqueueResponse(HttpStatusCode.OK, """{"taskUid":1,"indexUid":"empresas","status":"enqueued","type":"documentAdditionOrUpdate","enqueuedAt":"2026-01-01T00:00:00Z"}""");

        var act = async () => await _sut.IndexAsync(empresa);

        await act.Should().NotThrowAsync();
    }

    [Fact]
    public async Task DeleteFromIndexAsync_DeveChamarApiSemErro()
    {
        _handler.EnqueueResponse(HttpStatusCode.OK, """{"taskUid":2,"indexUid":"empresas","status":"enqueued","type":"documentDeletion","enqueuedAt":"2026-01-01T00:00:00Z"}""");

        var act = async () => await _sut.DeleteFromIndexAsync(Guid.NewGuid());

        await act.Should().NotThrowAsync();
    }

    [Fact]
    public async Task SearchAsync_DeveRetornarResultadosMapeados()
    {
        var searchResponse = """
        {
            "hits": [{
                "id": "a1b2c3d4-1234-5678-9abc-def012345678",
                "cnpj": "11222333000181",
                "razaoSocial": "Empresa Teste Ltda",
                "regime": 1,
                "createdAt": "2026-01-15T10:00:00Z"
            }],
            "query": "teste",
            "processingTimeMs": 0,
            "limit": 20,
            "offset": 0,
            "estimatedTotalHits": 1
        }
        """;
        _handler.EnqueueResponse(HttpStatusCode.OK, searchResponse);

        var results = await _sut.SearchAsync("teste");

        results.Should().HaveCount(1);
        results[0].Id.Should().Be(Guid.Parse("a1b2c3d4-1234-5678-9abc-def012345678"));
        results[0].CNPJ.Should().Be("11222333000181");
        results[0].RazaoSocial.Should().Be("Empresa Teste Ltda");
        results[0].Regime.Should().Be(RegimeTributario.SimplesNacional);
    }

    [Fact]
    public async Task SearchAsync_SemResultados_DeveRetornarListaVazia()
    {
        var searchResponse = """{"hits":[],"query":"zzzzz","processingTimeMs":0,"limit":20,"offset":0,"estimatedTotalHits":0}""";
        _handler.EnqueueResponse(HttpStatusCode.OK, searchResponse);

        var results = await _sut.SearchAsync("zzzzz");

        results.Should().BeEmpty();
    }

    private sealed class MockHttpMessageHandler : HttpMessageHandler
    {
        private readonly Queue<HttpResponseMessage> _responses = new();

        public void EnqueueResponse(HttpStatusCode statusCode, string jsonContent)
        {
            _responses.Enqueue(new HttpResponseMessage(statusCode)
            {
                Content = new StringContent(jsonContent, Encoding.UTF8, "application/json")
            });
        }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            if (_responses.Count == 0)
                return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK));

            return Task.FromResult(_responses.Dequeue());
        }
    }
}

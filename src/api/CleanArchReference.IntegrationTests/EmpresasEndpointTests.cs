using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using CleanArchReference.Application.Empresas.ViewModels;
using CleanArchReference.Domain.Enums;
using CleanArchReference.Shared.ResponseData;

namespace CleanArchReference.IntegrationTests;

public class EmpresasEndpointTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client;

    public EmpresasEndpointTests(TestWebApplicationFactory factory)
        => _client = factory.CreateClient();

    [Fact]
    public async Task GET_Empresas_DeveRetornarSucesso()
    {
        var response = await _client.GetAsync("/api/empresas");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadFromJsonAsync<ResponseData<IList<EmpresaResultViewModel>>>();
        body!.Success.Should().BeTrue();
    }

    [Fact]
    public async Task POST_Empresas_DeveCriarEmpresaRetornandoDados()
    {
        var payload = new CreateEmpresaViewModel
        {
            CNPJ = "11222333000181",
            RazaoSocial = "Empresa Teste Integração",
            Regime = RegimeTributario.SimplesNacional
        };

        var response = await _client.PostAsJsonAsync("/api/empresas", payload);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadFromJsonAsync<ResponseData<EmpresaResultViewModel>>();
        body!.Success.Should().BeTrue();
        body.Data!.CNPJ.Should().Be("11222333000181");
        body.Data.Regime.Should().Be(RegimeTributario.SimplesNacional);
        body.Data.Id.Should().NotBeEmpty();
    }

    [Fact]
    public async Task POST_Empresas_ComCnpjDuplicado_DeveRetornar409()
    {
        var payload = new CreateEmpresaViewModel
        {
            CNPJ = "22333444000172",
            RazaoSocial = "Empresa Original",
            Regime = RegimeTributario.LucroPresumido
        };
        await _client.PostAsJsonAsync("/api/empresas", payload);

        var response = await _client.PostAsJsonAsync("/api/empresas", payload);

        response.StatusCode.Should().Be(HttpStatusCode.Conflict);
    }

    [Fact]
    public async Task GET_SearchEmpresas_DeveRetornarSucesso()
    {
        var response = await _client.GetAsync("/api/empresas/search?q=padaria");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadFromJsonAsync<ResponseData<IList<EmpresaResultViewModel>>>();
        body!.Success.Should().BeTrue();
    }

    [Fact]
    public async Task DELETE_Empresa_DeveRemoverERetornar200()
    {
        var create = await _client.PostAsJsonAsync("/api/empresas", new CreateEmpresaViewModel
        {
            CNPJ = "33444555000163",
            RazaoSocial = "Empresa Para Deletar",
            Regime = RegimeTributario.LucroReal
        });
        var created = await create.Content.ReadFromJsonAsync<ResponseData<EmpresaResultViewModel>>();
        var id = created!.Data!.Id;

        var deleteResponse = await _client.DeleteAsync($"/api/empresas/{id}");

        deleteResponse.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}

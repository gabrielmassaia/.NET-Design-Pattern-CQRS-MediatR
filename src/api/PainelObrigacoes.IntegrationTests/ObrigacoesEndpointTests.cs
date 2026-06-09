using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using PainelObrigacoes.Application.Empresas.ViewModels;
using PainelObrigacoes.Application.Obrigacoes.ViewModels;
using PainelObrigacoes.Domain.Enums;
using PainelObrigacoes.Shared.ResponseData;

namespace PainelObrigacoes.IntegrationTests;

public class ObrigacoesEndpointTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client;

    public ObrigacoesEndpointTests(TestWebApplicationFactory factory)
        => _client = factory.CreateClient();

    private async Task<EmpresaResultViewModel> CriarEmpresa(string cnpj, RegimeTributario regime)
    {
        var response = await _client.PostAsJsonAsync("/api/empresas", new CreateEmpresaViewModel
        {
            CNPJ = cnpj,
            RazaoSocial = $"Empresa {cnpj}",
            Regime = regime
        });
        var body = await response.Content.ReadFromJsonAsync<ResponseData<EmpresaResultViewModel>>();
        return body!.Data!;
    }

    [Fact]
    public async Task GET_Obrigacoes_DeveRetornarObrigacoesParaSimples()
    {
        var empresa = await CriarEmpresa("44555666000145", RegimeTributario.SimplesNacional);
        var hoje = DateTime.UtcNow;

        var response = await _client.GetAsync(
            $"/api/obrigacoes?empresaId={empresa.Id}&ano={hoje.Year}&mes={hoje.Month}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content
            .ReadFromJsonAsync<ResponseData<IList<ObrigacaoResultViewModel>>>();
        body!.Success.Should().BeTrue();
        body.Data.Should().NotBeEmpty();
        body.Data.Should().Contain(o => o.Tipo == TipoObrigacao.DAS);
        body.Data.Should().Contain(o => o.Tipo == TipoObrigacao.eSocial);
    }

    [Fact]
    public async Task PATCH_RegistrarEntrega_DeveMarcarObrigacaoComoEntregue()
    {
        var empresa = await CriarEmpresa("55666777000136", RegimeTributario.SimplesNacional);
        var hoje = DateTime.UtcNow;

        var obrigacoesResponse = await _client.GetAsync(
            $"/api/obrigacoes?empresaId={empresa.Id}&ano={hoje.Year}&mes={hoje.Month}");
        var obrigacoes = await obrigacoesResponse.Content
            .ReadFromJsonAsync<ResponseData<IList<ObrigacaoResultViewModel>>>();
        var obrigacao = obrigacoes!.Data!.First(o => o.Tipo == TipoObrigacao.DAS);

        var patchResponse = await _client.PatchAsJsonAsync(
            $"/api/obrigacoes/{obrigacao.Id}/entrega",
            new RegistrarEntregaViewModel { DataEntrega = hoje });

        patchResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await patchResponse.Content
            .ReadFromJsonAsync<ResponseData<ObrigacaoResultViewModel>>();
        result!.Data!.Status.Should().Be(StatusObrigacao.Entregue);
        result.Data.DataEntrega.Should().NotBeNull();
    }

    [Fact]
    public async Task GET_ExportObrigacoes_DeveRetornarCSV()
    {
        var empresa = await CriarEmpresa("77888999000118", RegimeTributario.SimplesNacional);
        var hoje = DateTime.UtcNow;

        var response = await _client.GetAsync(
            $"/api/obrigacoes/export?empresaId={empresa.Id}&ano={hoje.Year}&mes={hoje.Month}&formato=csv");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        response.Content.Headers.ContentType!.MediaType.Should().Be("text/csv");
    }

    [Fact]
    public async Task GET_Historico_DeveRetornarObrigacoesEntregues()
    {
        var empresa = await CriarEmpresa("66777888000127", RegimeTributario.SimplesNacional);
        var hoje = DateTime.UtcNow;

        // Registrar uma entrega
        var obrigacoesResponse = await _client.GetAsync(
            $"/api/obrigacoes?empresaId={empresa.Id}&ano={hoje.Year}&mes={hoje.Month}");
        var obrigacoes = await obrigacoesResponse.Content
            .ReadFromJsonAsync<ResponseData<IList<ObrigacaoResultViewModel>>>();
        var dasId = obrigacoes!.Data!.First(o => o.Tipo == TipoObrigacao.DAS).Id;

        await _client.PatchAsJsonAsync(
            $"/api/obrigacoes/{dasId}/entrega",
            new RegistrarEntregaViewModel { DataEntrega = hoje });

        // Verificar histórico
        var historicoResponse = await _client.GetAsync(
            $"/api/obrigacoes/historico/{empresa.Id}");

        historicoResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var historico = await historicoResponse.Content
            .ReadFromJsonAsync<ResponseData<IList<ObrigacaoResultViewModel>>>();
        historico!.Data.Should().NotBeEmpty();
        historico.Data.Should().Contain(o => o.Tipo == TipoObrigacao.DAS);
    }
}

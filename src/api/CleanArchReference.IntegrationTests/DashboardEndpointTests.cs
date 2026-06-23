using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using CleanArchReference.Application.Dashboard.ViewModels;
using CleanArchReference.Shared.ResponseData;

namespace CleanArchReference.IntegrationTests;

public class DashboardEndpointTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client;

    public DashboardEndpointTests(TestWebApplicationFactory factory)
        => _client = factory.CreateClient();

    [Fact]
    public async Task GET_Dashboard_DeveRetornarKPIs()
    {
        var response = await _client.GetAsync("/api/dashboard");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadFromJsonAsync<ResponseData<DashboardResultViewModel>>();
        body!.Success.Should().BeTrue();
    }

    [Fact]
    public async Task GET_DashboardAlertas_DeveRetornarLista()
    {
        var response = await _client.GetAsync("/api/dashboard/alertas");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadFromJsonAsync<ResponseData<IList<AlertaResultViewModel>>>();
        body!.Success.Should().BeTrue();
    }

    [Fact]
    public async Task GET_DashboardExport_DeveRetornarCSV()
    {
        var response = await _client.GetAsync("/api/dashboard/export?formato=csv");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        response.Content.Headers.ContentType!.MediaType.Should().Be("text/csv");
    }

    [Fact]
    public async Task GET_DashboardAlertasExport_DeveRetornarCSV()
    {
        var response = await _client.GetAsync("/api/dashboard/alertas/export?formato=csv");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        response.Content.Headers.ContentType!.MediaType.Should().Be("text/csv");
    }
}

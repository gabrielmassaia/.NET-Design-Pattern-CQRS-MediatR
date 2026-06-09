using FluentAssertions;
using Moq;
using PainelObrigacoes.Domain.Empresas.Models;
using PainelObrigacoes.Domain.Empresas.Queries;
using PainelObrigacoes.Domain.Empresas.QueryHandlers;
using PainelObrigacoes.Domain.Empresas.Services;
using PainelObrigacoes.Domain.Enums;

namespace PainelObrigacoes.Tests.Domain.Empresas;

public class SearchEmpresasQueryHandlerTests
{
    private readonly Mock<IEmpresaSearchService> _searchServiceMock = new();
    private readonly SearchEmpresasQueryHandler _handler;

    public SearchEmpresasQueryHandlerTests()
    {
        _handler = new SearchEmpresasQueryHandler(_searchServiceMock.Object);
    }

    [Fact]
    public async Task Handle_DeveRetornarEmpresasEncontradas()
    {
        var empresas = new List<EmpresaModel>
        {
            new() { Id = Guid.NewGuid(), CNPJ = "11222333000181", RazaoSocial = "Padaria Sao Joao", Regime = RegimeTributario.SimplesNacional }
        };

        _searchServiceMock.Setup(s => s.SearchAsync("padaria", It.IsAny<CancellationToken>())).ReturnsAsync(empresas);

        var result = await _handler.Handle(new SearchEmpresasQuery { Query = "padaria" }, CancellationToken.None);

        result.Should().HaveCount(1);
        result[0].RazaoSocial.Should().Contain("Padaria");
    }

    [Fact]
    public async Task Handle_QuandoQueryVazia_DeveRetornarListaVazia()
    {
        _searchServiceMock.Setup(s => s.SearchAsync("", It.IsAny<CancellationToken>())).ReturnsAsync(new List<EmpresaModel>());

        var result = await _handler.Handle(new SearchEmpresasQuery { Query = "" }, CancellationToken.None);

        result.Should().BeEmpty();
    }
}

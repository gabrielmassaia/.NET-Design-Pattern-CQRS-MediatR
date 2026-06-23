using FluentAssertions;
using Moq;
using CleanArchReference.Domain.Empresas.Models;
using CleanArchReference.Domain.Empresas.Queries;
using CleanArchReference.Domain.Empresas.QueryHandlers;
using CleanArchReference.Domain.Empresas.Repositories;
using CleanArchReference.Domain.Enums;

namespace CleanArchReference.Tests.Domain.Empresas;

public class FindEmpresasQueryHandlerTests
{
    private readonly Mock<IEmpresaRepository> _repositoryMock = new();
    private readonly FindEmpresasQueryHandler _handler;

    public FindEmpresasQueryHandlerTests()
    {
        _handler = new FindEmpresasQueryHandler(_repositoryMock.Object);
    }

    [Fact]
    public async Task Handle_DeveRetornarEmpresasPaginadas()
    {
        var empresas = new List<EmpresaModel>
        {
            new() { Id = Guid.NewGuid(), CNPJ = "11222333000181", RazaoSocial = "Padaria", Regime = RegimeTributario.SimplesNacional }
        };

        _repositoryMock.Setup(r => r.FindAllAsync(0, 10)).ReturnsAsync(empresas);

        var result = await _handler.Handle(new FindEmpresasQuery { Skip = 0, Take = 10 }, CancellationToken.None);

        result.Should().HaveCount(1);
        result[0].RazaoSocial.Should().Be("Padaria");
    }

    [Fact]
    public async Task Handle_QuandoNaoHaEmpresas_DeveRetornarListaVazia()
    {
        _repositoryMock.Setup(r => r.FindAllAsync(0, 50)).ReturnsAsync(new List<EmpresaModel>());

        var result = await _handler.Handle(new FindEmpresasQuery(), CancellationToken.None);

        result.Should().BeEmpty();
    }
}

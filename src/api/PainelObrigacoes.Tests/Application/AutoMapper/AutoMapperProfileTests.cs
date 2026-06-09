using AutoMapper;
using FluentAssertions;
using PainelObrigacoes.Application.Dashboard.AutoMapper;
using PainelObrigacoes.Application.Empresas.AutoMapper;
using PainelObrigacoes.Application.Obrigacoes.AutoMapper;
using PainelObrigacoes.Application.Obrigacoes.ViewModels;
using PainelObrigacoes.Domain.Obrigacoes.Models;
using PainelObrigacoes.Domain.Obrigacoes.Queries;

namespace PainelObrigacoes.Tests.Application.AutoMapper;

public class AutoMapperProfileTests
{
    [Fact]
    public void DashboardProfile_DeveSerValido()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<DashboardProfile>());
        config.AssertConfigurationIsValid();
    }

    [Fact]
    public void EmpresaProfile_DeveSerValido()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<EmpresaProfile>());
        config.AssertConfigurationIsValid();
    }

    [Fact]
    public void ObrigacaoProfile_MapObrigacaoReadModel_DeveMapearCorretamente()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<ObrigacaoProfile>());
        var mapper = config.CreateMapper();

        var readModel = new ObrigacaoReadModel
        {
            Id = Guid.NewGuid(),
            EmpresaId = Guid.NewGuid(),
            RazaoSocial = "Empresa Teste",
            Competencia = new DateTime(2026, 6, 1),
            DataVencimento = new DateTime(2026, 7, 20),
            DataEntrega = new DateTime(2026, 7, 15),
        };

        var result = mapper.Map<ObrigacaoResultViewModel>(readModel);

        result.RazaoSocial.Should().Be("Empresa Teste");
        result.DataEntrega.Should().Be(new DateTime(2026, 7, 15));
    }

    [Fact]
    public void ObrigacaoProfile_MapFindObrigacoesViewModel_DeveMapearCorretamente()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<ObrigacaoProfile>());
        var mapper = config.CreateMapper();

        var viewModel = new FindObrigacoesViewModel
        {
            EmpresaId = Guid.NewGuid(),
            Ano = 2026,
            Mes = 6,
        };

        var result = mapper.Map<FindObrigacoesQuery>(viewModel);

        result.Ano.Should().Be(2026);
        result.Mes.Should().Be(6);
    }
}

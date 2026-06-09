using FluentAssertions;
using MediatR;
using Moq;
using PainelObrigacoes.Domain.Empresas.Commands;
using PainelObrigacoes.Domain.Empresas.Models;
using PainelObrigacoes.Domain.Empresas.Repositories;
using PainelObrigacoes.Domain.Enums;
using PainelObrigacoes.Domain.Empresas.CommandHandlers;
using PainelObrigacoes.Domain.Obrigacoes.Repositories;
using PainelObrigacoes.Domain.Obrigacoes.Services;
using PainelObrigacoes.Domain.Shared.Interfaces;
using PainelObrigacoes.Domain.Obrigacoes.Models;
using Xunit;

namespace PainelObrigacoes.Tests.Domain.Engine;

public class TributaryRulesEngineTests
{
    private readonly BusinessDayAdjuster _adjuster = new(new BrazilianHolidayProvider());
    private readonly DueDateCalculator _calculator;
    private readonly TributaryRulesEngine _engine;

    public TributaryRulesEngineTests()
    {
        _calculator = new DueDateCalculator(_adjuster);
        _engine = new TributaryRulesEngine(_calculator);
    }

    private static EmpresaModel Empresa(RegimeTributario regime) => new()
    {
        Id = Guid.NewGuid(), CNPJ = "00000000000000",
        RazaoSocial = "Teste", Regime = regime
    };

    [Fact]
    public void SimplesNacional_Janeiro_DeveTerObrigacoesCorretas()
    {
        var tipos = _engine.GenerateObrigacoes(Empresa(RegimeTributario.SimplesNacional), 2024, 1)
            .Select(o => o.Tipo).ToList();

        tipos.Should().Contain(TipoObrigacao.DAS);
        tipos.Should().Contain(TipoObrigacao.eSocial);
        tipos.Should().Contain(TipoObrigacao.DEFIS);
        tipos.Should().Contain(TipoObrigacao.DIRF);
        tipos.Should().Contain(TipoObrigacao.RAIS);
        tipos.Should().NotContain(TipoObrigacao.DCTF);
        tipos.Should().NotContain(TipoObrigacao.SPED_ECD);
        tipos.Should().NotContain(TipoObrigacao.SPED_ECF);
    }

    [Fact]
    public void SimplesNacional_ForaDeJaneiro_NaoDeveConterAnuais()
    {
        var tipos = _engine.GenerateObrigacoes(Empresa(RegimeTributario.SimplesNacional), 2024, 6)
            .Select(o => o.Tipo).ToList();

        tipos.Should().NotContain(TipoObrigacao.DEFIS);
        tipos.Should().NotContain(TipoObrigacao.DIRF);
        tipos.Should().NotContain(TipoObrigacao.RAIS);
        tipos.Should().Contain(TipoObrigacao.DAS);
        tipos.Should().Contain(TipoObrigacao.eSocial);
    }

    [Fact]
    public void LucroReal_Janeiro_DeveTerTodasAsObrigacoesDoRegime()
    {
        var tipos = _engine.GenerateObrigacoes(Empresa(RegimeTributario.LucroReal), 2024, 1)
            .Select(o => o.Tipo).ToList();

        tipos.Should().Contain(TipoObrigacao.DCTF);
        tipos.Should().Contain(TipoObrigacao.EFD_ICMS_IPI);
        tipos.Should().Contain(TipoObrigacao.EFD_Contribuicoes);
        tipos.Should().Contain(TipoObrigacao.EFD_Reinf);
        tipos.Should().Contain(TipoObrigacao.eSocial);
        tipos.Should().Contain(TipoObrigacao.SPED_ECD);
        tipos.Should().Contain(TipoObrigacao.SPED_ECF);
        tipos.Should().Contain(TipoObrigacao.DIRF);
        tipos.Should().Contain(TipoObrigacao.RAIS);
        tipos.Should().NotContain(TipoObrigacao.DAS);
        tipos.Should().NotContain(TipoObrigacao.DEFIS);
    }

    [Fact]
    public void ImunidadeIsencao_TodosOsMeses_NuncaGeraObrigacoes()
    {
        for (int mes = 1; mes <= 12; mes++)
            _engine.GenerateObrigacoes(Empresa(RegimeTributario.ImunidadeIsencao), 2024, mes)
                .Should().BeEmpty($"Imunidade/Isenção não deve gerar obrigações no mês {mes}");
    }

    [Fact]
    public void DAS_Janeiro2024_VenceEm20Fevereiro()
        => _calculator.Calculate(TipoObrigacao.DAS, 2024, 1)
            .Should().Be(new DateTime(2024, 2, 20));

    [Fact]
    public void DAS_Dezembro2023_VenceEm22Janeiro2024_PorAjusteFinDeSemana()
        => _calculator.Calculate(TipoObrigacao.DAS, 2023, 12)
            .Should().Be(new DateTime(2024, 1, 22));

    [Fact]
    public void DCTF_Marco2024_VenceEm15Maio()
        => _calculator.Calculate(TipoObrigacao.DCTF, 2024, 3)
            .Should().Be(new DateTime(2024, 5, 15));

    [Fact]
    public void SPED_ECD_Competencia2024_VenceEm31Maio2025()
        => _calculator.Calculate(TipoObrigacao.SPED_ECD, 2024, 1)
            .Should().Be(new DateTime(2025, 5, 31));

    [Fact]
    public void SPED_ECF_Competencia2024_VenceEm31Julho2025()
        => _calculator.Calculate(TipoObrigacao.SPED_ECF, 2024, 1)
            .Should().Be(new DateTime(2025, 7, 31));

    [Fact]
    public void DIRF_Competencia2024_VenceEm28Fevereiro2025()
        => _calculator.Calculate(TipoObrigacao.DIRF, 2024, 1)
            .Should().Be(new DateTime(2025, 2, 28));

    [Fact]
    public void RAIS_Competencia2024_VenceEm31Marco2025()
        => _calculator.Calculate(TipoObrigacao.RAIS, 2024, 1)
            .Should().Be(new DateTime(2025, 3, 31));

    [Fact]
    public void eSocial_Janeiro2024_VenceEm07Fevereiro()
        => _calculator.Calculate(TipoObrigacao.eSocial, 2024, 1)
            .Should().Be(new DateTime(2024, 2, 7));

    [Fact]
    public void DCTF_Dezembro2024_VenceEmFevereiro2025()
        => _calculator.Calculate(TipoObrigacao.DCTF, 2024, 12)
            .Should().Be(new DateTime(2025, 2, 15));

    [Fact]
    public void BusinessDayAdjuster_QuandoCaiNoNatal_DeveAjustarPara26()
    {
        var adjuster = new BusinessDayAdjuster(new BrazilianHolidayProvider());
        var data = new DateTime(2024, 12, 25);
        var ajustado = adjuster.Adjust(data);
        ajustado.Should().Be(new DateTime(2024, 12, 26));
    }

    [Fact]
    public void BusinessDayAdjuster_QuandoCaiNoSabado_DeveAjustarParaSegunda()
    {
        var adjuster = new BusinessDayAdjuster(new BrazilianHolidayProvider());
        var data = new DateTime(2024, 11, 2);
        if (data.DayOfWeek == DayOfWeek.Saturday)
        {
            var ajustado = adjuster.Adjust(data);
            ajustado.DayOfWeek.Should().Be(DayOfWeek.Monday);
        }
    }

    [Fact]
    public void LucroPresumido_Janeiro_DeveTerMesmaMatrizQueLucroReal()
    {
        var tipos = _engine.GenerateObrigacoes(Empresa(RegimeTributario.LucroPresumido), 2024, 1)
            .Select(o => o.Tipo).ToList();

        tipos.Should().Contain(TipoObrigacao.DCTF);
        tipos.Should().Contain(TipoObrigacao.EFD_ICMS_IPI);
        tipos.Should().Contain(TipoObrigacao.EFD_Contribuicoes);
        tipos.Should().Contain(TipoObrigacao.EFD_Reinf);
        tipos.Should().Contain(TipoObrigacao.eSocial);
        tipos.Should().Contain(TipoObrigacao.SPED_ECD);
        tipos.Should().Contain(TipoObrigacao.SPED_ECF);
        tipos.Should().Contain(TipoObrigacao.DIRF);
        tipos.Should().Contain(TipoObrigacao.RAIS);
    }

    [Fact]
    public void LucroPresumido_NaoDeveGerarDASnemDEFIS()
    {
        var tipos = _engine.GenerateObrigacoes(Empresa(RegimeTributario.LucroPresumido), 2024, 1)
            .Select(o => o.Tipo).ToList();

        tipos.Should().NotContain(TipoObrigacao.DAS);
        tipos.Should().NotContain(TipoObrigacao.DEFIS);
    }

    [Fact]
    public void LucroPresumido_ForaDeJaneiro_NaoDeveConterAnuais()
    {
        var tipos = _engine.GenerateObrigacoes(Empresa(RegimeTributario.LucroPresumido), 2024, 6)
            .Select(o => o.Tipo).ToList();

        tipos.Should().NotContain(TipoObrigacao.SPED_ECD);
        tipos.Should().NotContain(TipoObrigacao.SPED_ECF);
        tipos.Should().NotContain(TipoObrigacao.DIRF);
        tipos.Should().NotContain(TipoObrigacao.RAIS);
        tipos.Should().Contain(TipoObrigacao.DCTF);
        tipos.Should().Contain(TipoObrigacao.eSocial);
    }

    [Fact]
    public void SimplesNacional_NaoDeveGerarObrigacoesDeLucroPresumidoOuReal()
    {
        var tipos = _engine.GenerateObrigacoes(Empresa(RegimeTributario.SimplesNacional), 2024, 1)
            .Select(o => o.Tipo).ToList();

        tipos.Should().NotContain(TipoObrigacao.DCTF);
        tipos.Should().NotContain(TipoObrigacao.EFD_ICMS_IPI);
        tipos.Should().NotContain(TipoObrigacao.EFD_Contribuicoes);
        tipos.Should().NotContain(TipoObrigacao.EFD_Reinf);
        tipos.Should().NotContain(TipoObrigacao.SPED_ECD);
        tipos.Should().NotContain(TipoObrigacao.SPED_ECF);
    }

    [Fact]
    public void EFD_ICMS_IPI_Marco2024_VenceEm15Abril()
        => _calculator.Calculate(TipoObrigacao.EFD_ICMS_IPI, 2024, 3)
            .Should().Be(new DateTime(2024, 4, 15));

    [Fact]
    public void EFD_Contribuicoes_Marco2024_VenceEm15Abril()
        => _calculator.Calculate(TipoObrigacao.EFD_Contribuicoes, 2024, 3)
            .Should().Be(new DateTime(2024, 4, 15));

    [Fact]
    public void EFD_Reinf_Marco2024_VenceEm15Abril()
        => _calculator.Calculate(TipoObrigacao.EFD_Reinf, 2024, 3)
            .Should().Be(new DateTime(2024, 4, 15));

    [Fact]
    public void DEFIS_Competencia2024_VenceEm31Marco2025()
        => _calculator.Calculate(TipoObrigacao.DEFIS, 2024, 1)
            .Should().Be(new DateTime(2025, 3, 31));

    [Fact]
    public void DIRF_Competencia2023_VenceEm29Fevereiro2024()
        => _calculator.Calculate(TipoObrigacao.DIRF, 2023, 1)
            .Should().Be(new DateTime(2024, 2, 29));

    [Fact]
    public async Task CreateEmpresaHandler_DevePersistirEmpresaEObrigacoesEComitar()
    {
        var unitOfWork    = new Mock<IUnitOfWork>();
        var empresaRepo   = new Mock<IEmpresaRepository>();
        var obrigacaoRepo = new Mock<IObrigacaoRepository>();
        var engine        = new Mock<ITributaryRulesEngine>();
        var mediator      = new Mock<IMediator>();

        empresaRepo.Setup(r => r.ExistsByCnpjAsync(It.IsAny<string>())).ReturnsAsync(false);
        engine.Setup(e => e.GenerateAnoCompleto(It.IsAny<EmpresaModel>(), It.IsAny<int>()))
              .Returns([]);

        var clock = new Mock<IDateTimeProvider>();
        clock.Setup(c => c.CurrentYear).Returns(2024);
        clock.Setup(c => c.CurrentMonth).Returns(1);

        var handler = new CreateEmpresaCommandHandler(
            unitOfWork.Object, empresaRepo.Object, obrigacaoRepo.Object, engine.Object, mediator.Object, clock.Object);

        var result = await handler.Handle(new CreateEmpresaCommand
        {
            CNPJ = "11222333000181",
            RazaoSocial = "Empresa Teste",
            Regime = RegimeTributario.SimplesNacional
        }, CancellationToken.None);

        result.Should().NotBeNull();
        empresaRepo.Verify(r => r.Create(It.IsAny<EmpresaModel>()), Times.Once);
        unitOfWork.Verify(u => u.CompleteAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task CreateEmpresaHandler_CnpjDuplicado_DeveLancarExceptionSemComitar()
    {
        var unitOfWork    = new Mock<IUnitOfWork>();
        var empresaRepo   = new Mock<IEmpresaRepository>();
        var obrigacaoRepo = new Mock<IObrigacaoRepository>();
        var engine        = new Mock<ITributaryRulesEngine>();
        var mediator      = new Mock<IMediator>();
        var clock         = new Mock<IDateTimeProvider>();

        empresaRepo.Setup(r => r.ExistsByCnpjAsync(It.IsAny<string>())).ReturnsAsync(true);

        var handler = new CreateEmpresaCommandHandler(
            unitOfWork.Object, empresaRepo.Object, obrigacaoRepo.Object, engine.Object, mediator.Object, clock.Object);

        var act = async () => await handler.Handle(new CreateEmpresaCommand
        {
            CNPJ = "11222333000181",
            RazaoSocial = "Empresa Teste",
            Regime = RegimeTributario.SimplesNacional
        }, CancellationToken.None);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("CNPJ já cadastrado.");

        unitOfWork.Verify(u => u.CompleteAsync(It.IsAny<CancellationToken>()), Times.Never);
    }
}

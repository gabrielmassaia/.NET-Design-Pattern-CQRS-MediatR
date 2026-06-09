using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Moq;
using PainelObrigacoes.Domain.Empresas.Models;
using PainelObrigacoes.Domain.Empresas.Repositories;
using PainelObrigacoes.Domain.Enums;
using PainelObrigacoes.Domain.Obrigacoes.Models;
using PainelObrigacoes.Domain.Obrigacoes.Repositories;
using PainelObrigacoes.Domain.Obrigacoes.Services;
using PainelObrigacoes.Domain.Shared.Interfaces;
using PainelObrigacoes.Infrastructure.Data.Services;

namespace PainelObrigacoes.Tests.Infrastructure.Data.Services;

public class YearRolloverServiceTests
{
    private static EmpresaModel EmpresaValida() => new()
    {
        Id = Guid.NewGuid(),
        CNPJ = "11222333000181",
        RazaoSocial = "Empresa Teste Ltda",
        Regime = RegimeTributario.SimplesNacional
    };

    private Mock<IServiceScopeFactory> CreateScopeFactory(
        IList<EmpresaModel> empresas,
        bool hasObrigacoes,
        Mock<ITributaryRulesEngine>? engine = null,
        Mock<IObrigacaoRepository>? obrigacaoRepo = null,
        Mock<IUnitOfWork>? uow = null,
        int ano = 2026)
    {
        var clock = new Mock<IDateTimeProvider>();
        clock.Setup(c => c.CurrentYear).Returns(ano);

        engine ??= new Mock<ITributaryRulesEngine>();
        engine.Setup(e => e.GenerateAnoCompleto(It.IsAny<EmpresaModel>(), It.IsAny<int>())).Returns([]);

        obrigacaoRepo ??= new Mock<IObrigacaoRepository>();
        obrigacaoRepo.Setup(r => r.HasObrigacoesInYearAsync(It.IsAny<Guid>(), It.IsAny<int>()))
            .ReturnsAsync(hasObrigacoes);

        var empresaRepo = new Mock<IEmpresaRepository>();
        empresaRepo.Setup(r => r.FindAllAsync(It.IsAny<int>(), It.IsAny<int>()))
            .ReturnsAsync(empresas);

        uow ??= new Mock<IUnitOfWork>();
        uow.Setup(u => u.CompleteAsync(It.IsAny<CancellationToken>())).Returns(Task.CompletedTask);

        var services = new ServiceCollection();
        services.AddSingleton(clock.Object);
        services.AddSingleton(empresaRepo.Object);
        services.AddSingleton(obrigacaoRepo.Object);
        services.AddSingleton(engine.Object);
        services.AddSingleton(uow.Object);

        var scope = new Mock<IServiceScope>();
        scope.Setup(s => s.ServiceProvider).Returns(services.BuildServiceProvider());

        var scopeFactory = new Mock<IServiceScopeFactory>();
        scopeFactory.Setup(f => f.CreateScope()).Returns(scope.Object);

        return scopeFactory;
    }

    [Fact]
    public async Task StartAsync_NaoDeveLancarExcecao()
    {
        var scopeFactory = CreateScopeFactory(empresas: [], hasObrigacoes: false);
        var service = new YearRolloverService(scopeFactory.Object);

        var act = async () => await service.StartAsync(CancellationToken.None);

        await act.Should().NotThrowAsync();
        service.Dispose();
    }

    [Fact]
    public async Task StartAsync_EmpresaSemObrigacoes_DeveGerarObrigacoes()
    {
        var empresa = EmpresaValida();
        var obrigacaoRepo = new Mock<IObrigacaoRepository>();
        var engine = new Mock<ITributaryRulesEngine>();

        engine.Setup(e => e.GenerateAnoCompleto(empresa, 2026)).Returns(new List<ObrigacaoModel>
        {
            new() { Id = Guid.NewGuid(), EmpresaId = empresa.Id, Tipo = TipoObrigacao.DAS }
        });

        var scopeFactory = CreateScopeFactory(
            empresas: [empresa],
            hasObrigacoes: false,
            engine: engine,
            obrigacaoRepo: obrigacaoRepo);

        var service = new YearRolloverService(scopeFactory.Object);
        await service.StartAsync(CancellationToken.None);

        engine.Verify(e => e.GenerateAnoCompleto(empresa, 2026), Times.Once);
        obrigacaoRepo.Verify(r => r.CreateRange(It.IsAny<IEnumerable<ObrigacaoModel>>()), Times.Once);
        service.Dispose();
    }

    [Fact]
    public async Task StartAsync_EmpresaComObrigacoes_NaoDeveGerarNovamente()
    {
        var empresa = EmpresaValida();
        var obrigacaoRepo = new Mock<IObrigacaoRepository>();
        var engine = new Mock<ITributaryRulesEngine>();

        var scopeFactory = CreateScopeFactory(
            empresas: [empresa],
            hasObrigacoes: true,
            engine: engine,
            obrigacaoRepo: obrigacaoRepo);

        var service = new YearRolloverService(scopeFactory.Object);
        await service.StartAsync(CancellationToken.None);

        engine.Verify(e => e.GenerateAnoCompleto(It.IsAny<EmpresaModel>(), It.IsAny<int>()), Times.Never);
        obrigacaoRepo.Verify(r => r.CreateRange(It.IsAny<IEnumerable<ObrigacaoModel>>()), Times.Never);
        service.Dispose();
    }

    [Fact]
    public async Task StopAsync_DevePararOTimer()
    {
        var scopeFactory = CreateScopeFactory(empresas: [], hasObrigacoes: false);
        var service = new YearRolloverService(scopeFactory.Object);
        await service.StartAsync(CancellationToken.None);

        var act = async () => await service.StopAsync(CancellationToken.None);

        await act.Should().NotThrowAsync();
        service.Dispose();
    }

    [Fact]
    public void Dispose_DeveFinalizarRecursos()
    {
        var scopeFactory = CreateScopeFactory(empresas: [], hasObrigacoes: false);
        var service = new YearRolloverService(scopeFactory.Object);
        service.Dispose();
    }
}

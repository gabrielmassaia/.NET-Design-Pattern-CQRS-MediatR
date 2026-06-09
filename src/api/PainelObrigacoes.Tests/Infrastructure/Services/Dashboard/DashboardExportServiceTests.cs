using System.Text;
using FluentAssertions;
using PainelObrigacoes.Application.Dashboard.ViewModels;
using PainelObrigacoes.Domain.Enums;
using PainelObrigacoes.Infrastructure.Services.Dashboard;
using QuestPDF.Infrastructure;

namespace PainelObrigacoes.Tests.Infrastructure.Services.Dashboard;

public class DashboardExportServiceTests
{
    private readonly DashboardExportService _sut = new();

    static DashboardExportServiceTests()
    {
        QuestPDF.Settings.License = LicenseType.Community;
    }

    private static List<AlertaResultViewModel> AlertasSample() =>
    [
        new()
        {
            Id = Guid.NewGuid(),
            RazaoSocial = "Empresa A",
            CNPJ = "11.222.333/0001-81",
            TipoNome = "DAS",
            DataVencimento = new DateTime(2026, 7, 20),
            DiasRestantes = 15,
            Status = StatusObrigacao.Pendente,
        },
        new()
        {
            Id = Guid.NewGuid(),
            RazaoSocial = "Empresa B",
            CNPJ = "44.555.666/0001-99",
            TipoNome = "DCTF",
            DataVencimento = new DateTime(2026, 6, 20),
            DiasRestantes = -5,
            Status = StatusObrigacao.Atrasada,
        },
    ];

    private static DashboardResultViewModel DashboardSample() => new()
    {
        TotalEmpresas = 5,
        TotalObrigacoesMes = 12,
        Pendentes = 7,
        Entregues = 3,
        Atrasadas = 2,
    };

    private static string BytesToString(byte[] bytes) =>
        Encoding.UTF8.GetString(bytes[Encoding.UTF8.GetPreamble().Length..]);

    [Fact]
    public void ToCsvAlertas_DeveConterCabecalho()
    {
        var result = _sut.ToCsvAlertas([]);

        var csv = BytesToString(result);
        csv.Should().Contain("Empresa");
        csv.Should().Contain("CNPJ");
        csv.Should().Contain("Obrigação");
        csv.Should().Contain("Vencimento");
        csv.Should().Contain("Dias Restantes");
        csv.Should().Contain("Status");
    }

    [Fact]
    public void ToCsvAlertas_DeveConterDados()
    {
        var result = _sut.ToCsvAlertas(AlertasSample());

        var csv = BytesToString(result);
        csv.Should().Contain("Empresa A");
        csv.Should().Contain("Empresa B");
        csv.Should().Contain("DAS");
        csv.Should().Contain("DCTF");
    }

    [Fact]
    public void ToCsvAlertas_DiasRestantesPositivos_ExibeDias()
    {
        var result = _sut.ToCsvAlertas(AlertasSample());

        var csv = BytesToString(result);
        csv.Should().Contain("15d restantes");
    }

    [Fact]
    public void ToCsvAlertas_DiasRestantesNegativos_ExibeAtraso()
    {
        var result = _sut.ToCsvAlertas(AlertasSample());

        var csv = BytesToString(result);
        csv.Should().Contain("5d em atraso");
    }

    [Fact]
    public void ToCsvDashboard_DeveConterIndicadores()
    {
        var result = _sut.ToCsvDashboard(DashboardSample(), AlertasSample());

        var csv = BytesToString(result);
        csv.Should().Contain("INDICADORES DO MÊS ATUAL");
        csv.Should().Contain("Total de Empresas");
        csv.Should().Contain("5");
        csv.Should().Contain("Obrigações do Mês");
        csv.Should().Contain("12");
    }

    [Fact]
    public void ToCsvDashboard_DeveConterAlertas()
    {
        var result = _sut.ToCsvDashboard(DashboardSample(), AlertasSample());

        var csv = BytesToString(result);
        csv.Should().Contain("ALERTAS DE VENCIMENTO");
        csv.Should().Contain("Empresa A");
    }

    [Fact]
    public void ToCsv_PrevenirCsvInjection_EscapaCaracteresPerigosos()
    {
        var alertas = new List<AlertaResultViewModel>
        {
            new()
            {
                Id = Guid.NewGuid(),
                RazaoSocial = "=CMD",
                CNPJ = "00.000.000/0000-00",
                TipoNome = "DAS",
                DataVencimento = DateTime.Now,
                DiasRestantes = 10,
                Status = StatusObrigacao.Pendente,
            },
        };

        var result = _sut.ToCsvAlertas(alertas);

        var csv = BytesToString(result);
        csv.Should().Contain("\"\t=CMD\"");
    }

    [Fact]
    public void ToPdfAlertas_DeveGerarBytesValidos()
    {
        var result = _sut.ToPdfAlertas(AlertasSample());

        result.Should().NotBeNull();
        result.Length.Should().BeGreaterThan(0);
        result[0].Should().Be(0x25);
    }

    [Fact]
    public void ToPdfDashboard_DeveGerarBytesValidos()
    {
        var result = _sut.ToPdfDashboard(DashboardSample(), AlertasSample());

        result.Should().NotBeNull();
        result.Length.Should().BeGreaterThan(0);
        result[0].Should().Be(0x25);
    }

    [Fact]
    public void ToPdfAlertas_DadosVazios_DeveGerarPdf()
    {
        var result = _sut.ToPdfAlertas([]);

        result.Should().NotBeNull();
        result.Length.Should().BeGreaterThan(0);
    }

    [Fact]
    public void ToPdfDashboard_DadosVazios_DeveGerarPdf()
    {
        var result = _sut.ToPdfDashboard(DashboardSample(), []);

        result.Should().NotBeNull();
        result.Length.Should().BeGreaterThan(0);
    }
}

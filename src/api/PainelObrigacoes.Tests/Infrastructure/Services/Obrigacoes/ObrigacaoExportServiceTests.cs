using System.Text;
using FluentAssertions;
using PainelObrigacoes.Application.Obrigacoes.ViewModels;
using PainelObrigacoes.Domain.Enums;
using PainelObrigacoes.Infrastructure.Services.Obrigacoes;
using QuestPDF.Infrastructure;

namespace PainelObrigacoes.Tests.Infrastructure.Services.Obrigacoes;

public class ObrigacaoExportServiceTests
{
    private readonly ObrigacaoExportService _sut = new();

    static ObrigacaoExportServiceTests()
    {
        QuestPDF.Settings.License = LicenseType.Community;
    }

    private static List<ObrigacaoResultViewModel> SampleData() =>
    [
        new()
        {
            Id = Guid.NewGuid(),
            RazaoSocial = "Empresa A Ltda",
            TipoNome = "DAS",
            Competencia = new DateTime(2026, 6, 1),
            DataVencimento = new DateTime(2026, 7, 20),
            DataEntrega = null,
            Status = StatusObrigacao.Pendente,
        },
        new()
        {
            Id = Guid.NewGuid(),
            RazaoSocial = "Empresa B S.A.",
            TipoNome = "DCTF",
            Competencia = new DateTime(2026, 6, 1),
            DataVencimento = new DateTime(2026, 7, 15),
            DataEntrega = new DateTime(2026, 7, 10),
            Status = StatusObrigacao.Entregue,
        },
    ];

    private static string BytesToString(byte[] bytes) =>
        Encoding.UTF8.GetString(bytes[Encoding.UTF8.GetPreamble().Length..]);

    [Fact]
    public void ToCsv_DeveConterCabecalho()
    {
        var result = _sut.ToCsv([], 2026, 6);

        var csv = BytesToString(result);
        csv.Should().Contain("Empresa");
        csv.Should().Contain("Obrigação");
        csv.Should().Contain("Competência");
        csv.Should().Contain("Vencimento");
        csv.Should().Contain("Entregue em");
        csv.Should().Contain("Status");
    }

    [Fact]
    public void ToCsv_DeveConterDadosDasObrigacoes()
    {
        var result = _sut.ToCsv(SampleData(), 2026, 6);

        var csv = BytesToString(result);
        csv.Should().Contain("Empresa A Ltda");
        csv.Should().Contain("Empresa B S.A.");
        csv.Should().Contain("DAS");
        csv.Should().Contain("DCTF");
        csv.Should().Contain("06/2026");
        csv.Should().Contain("20/07/2026");
    }

    [Fact]
    public void ToCsv_DeveIncluirBomUtf8()
    {
        var result = _sut.ToCsv([], 2026, 6);

        var preamble = Encoding.UTF8.GetPreamble();
        result[..preamble.Length].Should().Equal(preamble);
    }

    [Fact]
    public void ToCsv_ObrigacaoEntregue_DeveConterDataEntrega()
    {
        var result = _sut.ToCsv(SampleData(), 2026, 6);

        var csv = BytesToString(result);
        csv.Should().Contain("10/07/2026");
    }

    [Fact]
    public void ToCsv_ObrigacaoPendente_DeveTerDataEntregaVazia()
    {
        var data = SampleData();
        var result = _sut.ToCsv([data[0]], 2026, 6);

        var csv = BytesToString(result);
        var lines = csv.Split(Environment.NewLine, StringSplitOptions.RemoveEmptyEntries);
        lines[1].Should().NotContain("10/07/2026");
    }

    [Fact]
    public void ToCsv_StatusLabel_DeveUsarLabelCorreto()
    {
        var data = SampleData();
        var result = _sut.ToCsv(data, 2026, 6);

        var csv = BytesToString(result);
        csv.Should().Contain("Pendente");
        csv.Should().Contain("Entregue");
    }

    [Fact]
    public void ToCsv_PrevenirCsvInjection_EscapaCaracteresPerigosos()
    {
        var data = new List<ObrigacaoResultViewModel>
        {
            new()
            {
                Id = Guid.NewGuid(),
                RazaoSocial = "=SUM(1,1)",
                TipoNome = "DAS",
                Competencia = new DateTime(2026, 6, 1),
                DataVencimento = new DateTime(2026, 7, 20),
                Status = StatusObrigacao.Pendente,
            },
        };

        var result = _sut.ToCsv(data, 2026, 6);

        var csv = BytesToString(result);
        csv.Should().Contain("\"\t=SUM(1,1)\"");
    }

    [Fact]
    public void ToPdf_DeveGerarBytesValidos()
    {
        var result = _sut.ToPdf(SampleData(), 2026, 6);

        result.Should().NotBeNull();
        result.Length.Should().BeGreaterThan(0);
        result[0].Should().Be(0x25); // % - PDF magic byte
    }

    [Fact]
    public void ToPdf_DadosVazios_DeveGerarPdf()
    {
        var result = _sut.ToPdf([], 2026, 6);

        result.Should().NotBeNull();
        result.Length.Should().BeGreaterThan(0);
    }
}

using System.Text;
using PainelObrigacoes.Application.Obrigacoes.Services;
using PainelObrigacoes.Application.Obrigacoes.ViewModels;
using PainelObrigacoes.Domain.Enums;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace PainelObrigacoes.Infrastructure.Services.Obrigacoes;

public sealed class ObrigacaoExportService : IObrigacaoExportService
{
    private static readonly string[] CsvHeader =
        ["Empresa", "Obrigação", "Competência", "Vencimento", "Entregue em", "Status"];

    public byte[] ToCsv(IList<ObrigacaoResultViewModel> obrigacoes, int ano, int mes)
    {
        var sb = new StringBuilder();
        sb.AppendLine(BuildCsvRow(CsvHeader));

        foreach (var o in obrigacoes)
        {
            sb.AppendLine(BuildCsvRow([
                o.RazaoSocial,
                o.TipoNome,
                o.Competencia.ToString("MM/yyyy"),
                o.DataVencimento.ToString("dd/MM/yyyy"),
                o.DataEntrega?.ToString("dd/MM/yyyy") ?? "",
                StatusLabel(o.Status),
            ]));
        }

        // BOM UTF-8 para compatibilidade com Excel
        return Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(sb.ToString())).ToArray();
    }

    public byte[] ToPdf(IList<ObrigacaoResultViewModel> obrigacoes, int ano, int mes)
    {
        var empresaNome = obrigacoes.FirstOrDefault()?.RazaoSocial ?? "—";
        var competencia = $"{mes:D2}/{ano}";

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4.Landscape());
                page.Margin(30);
                page.DefaultTextStyle(x => x.FontSize(9));

                page.Header().Column(col =>
                {
                    col.Item().Text("Painel de Obrigações Acessórias")
                        .Bold().FontSize(14).FontColor("#1565C0");
                    col.Item().Text($"Empresa: {empresaNome}  |  Competência: {competencia}")
                        .FontSize(9).FontColor("#555555");
                });

                page.Content().PaddingTop(10).Table(table =>
                {
                    table.ColumnsDefinition(cols =>
                    {
                        cols.RelativeColumn(3);
                        cols.RelativeColumn(2);
                        cols.RelativeColumn(2);
                        cols.RelativeColumn(2);
                    });

                    static IContainer HeaderCell(IContainer c) =>
                        c.Background("#1565C0").Padding(5);

                    table.Header(header =>
                    {
                        foreach (var title in new[] { "Obrigação", "Vencimento", "Entregue em", "Status" })
                            header.Cell().Element(HeaderCell)
                                  .Text(title).Bold().FontColor("#FFFFFF");
                    });

                    foreach (var o in obrigacoes)
                    {
                        var rowBg = o.Status switch
                        {
                            StatusObrigacao.Atrasada => "#FFEBEE",
                            StatusObrigacao.Entregue => "#E8F5E9",
                            _ => "#FFFFFF",
                        };

                        var statusColor = o.Status switch
                        {
                            StatusObrigacao.Atrasada => "#C62828",
                            StatusObrigacao.Entregue => "#2E7D32",
                            _ => "#000000",
                        };

                        IContainer DataCell(IContainer c) =>
                            c.Background(rowBg).BorderBottom(1).BorderColor("#EEEEEE").Padding(5);

                        table.Cell().Element(DataCell).Text(o.TipoNome);
                        table.Cell().Element(DataCell).Text(o.DataVencimento.ToString("dd/MM/yyyy"));
                        table.Cell().Element(DataCell).Text(o.DataEntrega?.ToString("dd/MM/yyyy") ?? "—");
                        table.Cell().Element(DataCell).Text(StatusLabel(o.Status)).FontColor(statusColor);
                    }
                });

                page.Footer().AlignRight()
                    .Text($"Gerado em {DateTime.Now:dd/MM/yyyy HH:mm}  |  Total: {obrigacoes.Count} obrigação(ões)")
                    .FontSize(8).FontColor("#888888");
            });
        });

        return document.GeneratePdf();
    }

    private static string StatusLabel(StatusObrigacao status) => status switch
    {
        StatusObrigacao.Pendente     => "Pendente",
        StatusObrigacao.Atrasada     => "Atrasada",
        StatusObrigacao.Entregue     => "Entregue",
        StatusObrigacao.NaoAplicavel => "Não Aplicável",
        _                            => status.ToString(),
    };

    private static string BuildCsvRow(string[] fields)
        => string.Join(",", fields.Select(f =>
        {
            var escaped = f.Replace("\"", "\"\"");
            if (escaped.Length > 0 && "+-=@".Contains(escaped[0]))
                escaped = "\t" + escaped;
            return $"\"{escaped}\"";
        }));
}

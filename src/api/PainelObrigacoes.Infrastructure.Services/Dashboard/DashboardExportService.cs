using System.Text;
using ClosedXML.Excel;
using PainelObrigacoes.Application.Dashboard.Services;
using PainelObrigacoes.Application.Dashboard.ViewModels;
using PainelObrigacoes.Domain.Enums;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace PainelObrigacoes.Infrastructure.Services.Dashboard;

public sealed class DashboardExportService : IDashboardExportService
{
    private static readonly string[] AlertasCsvHeader =
        ["Empresa", "CNPJ", "Obrigação", "Vencimento", "Dias Restantes", "Status"];

    public byte[] ToCsvAlertas(IList<AlertaResultViewModel> alertas)
    {
        var sb = new StringBuilder();
        sb.AppendLine(BuildCsvRow(AlertasCsvHeader));
        foreach (var a in alertas)
            sb.AppendLine(BuildCsvRow([
                a.RazaoSocial,
                a.CNPJ,
                a.TipoNome,
                a.DataVencimento.ToString("dd/MM/yyyy"),
                a.DiasRestantes < 0 ? $"{Math.Abs(a.DiasRestantes)}d em atraso" : $"{a.DiasRestantes}d restantes",
                StatusLabel(a.Status),
            ]));
        return Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(sb.ToString())).ToArray();
    }

    public byte[] ToPdfAlertas(IList<AlertaResultViewModel> alertas)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4.Landscape());
                page.Margin(30);
                page.DefaultTextStyle(x => x.FontSize(9));

                page.Header().Column(col =>
                {
                    col.Item().Text("Painel de Alertas de Vencimento")
                        .Bold().FontSize(14).FontColor("#C62828");
                    col.Item().Text($"Obrigações vencendo nos próximos 30 dias e já atrasadas  |  Gerado em {DateTime.Now:dd/MM/yyyy HH:mm}")
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
                        cols.RelativeColumn(2);
                        cols.RelativeColumn(2);
                    });

                    static IContainer HeaderCell(IContainer c) =>
                        c.Background("#C62828").Padding(5);

                    table.Header(header =>
                    {
                        foreach (var title in AlertasCsvHeader)
                            header.Cell().Element(HeaderCell)
                                  .Text(title).Bold().FontColor("#FFFFFF");
                    });

                    foreach (var a in alertas)
                    {
                        var rowBg = a.Status == StatusObrigacao.Atrasada ? "#FFEBEE" : "#FFFFFF";
                        var diasColor = a.DiasRestantes < 0 ? "#C62828"
                            : a.DiasRestantes <= 7 ? "#F57F17"
                            : "#2E7D32";

                        IContainer DataCell(IContainer c) =>
                            c.Background(rowBg).BorderBottom(1).BorderColor("#EEEEEE").Padding(5);

                        table.Cell().Element(DataCell).Text(a.RazaoSocial);
                        table.Cell().Element(DataCell).Text(a.CNPJ);
                        table.Cell().Element(DataCell).Text(a.TipoNome);
                        table.Cell().Element(DataCell).Text(a.DataVencimento.ToString("dd/MM/yyyy"));
                        table.Cell().Element(DataCell).Text(
                            a.DiasRestantes < 0
                                ? $"{Math.Abs(a.DiasRestantes)}d em atraso"
                                : $"{a.DiasRestantes}d restantes"
                        ).FontColor(diasColor);
                        table.Cell().Element(DataCell).Text(StatusLabel(a.Status));
                    }
                });

                page.Footer().AlignRight()
                    .Text($"Total: {alertas.Count} alerta(s)")
                    .FontSize(8).FontColor("#888888");
            });
        });

        return document.GeneratePdf();
    }

    public byte[] ToCsvDashboard(DashboardResultViewModel dashboard, IList<AlertaResultViewModel> alertas)
    {
        var sb = new StringBuilder();

        sb.AppendLine(BuildCsvRow(["Indicador", "Valor"]));
        sb.AppendLine(BuildCsvRow(["Total de Empresas", dashboard.TotalEmpresas.ToString()]));
        sb.AppendLine(BuildCsvRow(["Obrigações do Mês", dashboard.TotalObrigacoesMes.ToString()]));
        sb.AppendLine(BuildCsvRow(["Pendentes", dashboard.Pendentes.ToString()]));
        sb.AppendLine(BuildCsvRow(["Atrasadas", dashboard.Atrasadas.ToString()]));
        sb.AppendLine(BuildCsvRow(["Entregues", dashboard.Entregues.ToString()]));

        return Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(sb.ToString())).ToArray();
    }

    public byte[] ToPdfDashboard(DashboardResultViewModel dashboard, IList<AlertaResultViewModel> alertas)
    {
        var now = DateTime.Now;
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4.Landscape());
                page.Margin(30);
                page.DefaultTextStyle(x => x.FontSize(9));

                page.Header().Column(col =>
                {
                    col.Item().Text("Relatório de Auditoria — Painel de Obrigações Acessórias")
                        .Bold().FontSize(14).FontColor("#1565C0");
                    col.Item().Text($"Competência: {now:MM/yyyy}  |  Gerado em {now:dd/MM/yyyy HH:mm}")
                        .FontSize(9).FontColor("#555555");
                });

                page.Content().PaddingTop(10).Column(col =>
                {
                    col.Item().Text("Indicadores do Mês").Bold().FontSize(11).FontColor("#1565C0");
                    col.Item().PaddingTop(6).Table(kpiTable =>
                    {
                        kpiTable.ColumnsDefinition(cols =>
                        {
                            cols.RelativeColumn();
                            cols.RelativeColumn();
                            cols.RelativeColumn();
                            cols.RelativeColumn();
                            cols.RelativeColumn();
                        });

                        static IContainer KpiHeader(IContainer c) =>
                            c.Background("#1565C0").Padding(6).AlignCenter();
                        static IContainer KpiValue(IContainer c) =>
                            c.Background("#E3F2FD").Padding(6).AlignCenter();

                        kpiTable.Header(h =>
                        {
                            foreach (var title in new[] { "Empresas", "Obrigações do Mês", "Pendentes", "Atrasadas", "Entregues" })
                                h.Cell().Element(KpiHeader).Text(title).Bold().FontColor("#FFFFFF");
                        });

                        foreach (var (val, color) in new[]
                        {
                            (dashboard.TotalEmpresas.ToString(), "#1565C0"),
                            (dashboard.TotalObrigacoesMes.ToString(), "#00ACC1"),
                            (dashboard.Pendentes.ToString(), "#F57F17"),
                            (dashboard.Atrasadas.ToString(), "#C62828"),
                            (dashboard.Entregues.ToString(), "#2E7D32"),
                        })
                            kpiTable.Cell().Element(KpiValue).Text(val).Bold().FontSize(14).FontColor(color);
                    });

                    col.Item().PaddingTop(20).Text("Alertas de Vencimento").Bold().FontSize(11).FontColor("#C62828");
                    col.Item().PaddingTop(6).Table(table =>
                    {
                        table.ColumnsDefinition(cols =>
                        {
                            cols.RelativeColumn(3);
                            cols.RelativeColumn(2);
                            cols.RelativeColumn(2);
                            cols.RelativeColumn(2);
                            cols.RelativeColumn(2);
                            cols.RelativeColumn(2);
                        });

                        static IContainer AlertHeader(IContainer c) =>
                            c.Background("#C62828").Padding(5);

                        table.Header(header =>
                        {
                            foreach (var title in AlertasCsvHeader)
                                header.Cell().Element(AlertHeader)
                                      .Text(title).Bold().FontColor("#FFFFFF");
                        });

                        foreach (var a in alertas)
                        {
                            var rowBg = a.Status == StatusObrigacao.Atrasada ? "#FFEBEE" : "#FFFFFF";
                            var diasColor = a.DiasRestantes < 0 ? "#C62828"
                                : a.DiasRestantes <= 7 ? "#F57F17"
                                : "#2E7D32";

                            IContainer DataCell(IContainer c) =>
                                c.Background(rowBg).BorderBottom(1).BorderColor("#EEEEEE").Padding(5);

                            table.Cell().Element(DataCell).Text(a.RazaoSocial);
                            table.Cell().Element(DataCell).Text(a.CNPJ);
                            table.Cell().Element(DataCell).Text(a.TipoNome);
                            table.Cell().Element(DataCell).Text(a.DataVencimento.ToString("dd/MM/yyyy"));
                            table.Cell().Element(DataCell).Text(
                                a.DiasRestantes < 0
                                    ? $"{Math.Abs(a.DiasRestantes)}d em atraso"
                                    : $"{a.DiasRestantes}d restantes"
                            ).FontColor(diasColor);
                            table.Cell().Element(DataCell).Text(StatusLabel(a.Status));
                        }
                    });
                });

                page.Footer().AlignRight()
                    .Text($"Total alertas: {alertas.Count}  |  Pendentes: {dashboard.Pendentes}  |  Atrasadas: {dashboard.Atrasadas}  |  Entregues: {dashboard.Entregues}")
                    .FontSize(8).FontColor("#888888");
            });
        });

        return document.GeneratePdf();
    }

    public byte[] ToXlsxAlertas(IList<AlertaResultViewModel> alertas)
    {
        using var workbook = new XLWorkbook();
        var ws = workbook.Worksheets.Add("Alertas");
        var headers = AlertasCsvHeader;

        for (var c = 0; c < headers.Length; c++)
            ws.Cell(1, c + 1).Value = headers[c];

        for (var r = 0; r < alertas.Count; r++)
        {
            var a = alertas[r];
            ws.Cell(r + 2, 1).Value = a.RazaoSocial;
            ws.Cell(r + 2, 2).Value = a.CNPJ;
            ws.Cell(r + 2, 3).Value = a.TipoNome;
            ws.Cell(r + 2, 4).Value = a.DataVencimento.ToString("dd/MM/yyyy");
            ws.Cell(r + 2, 5).Value = a.DiasRestantes < 0
                ? $"{Math.Abs(a.DiasRestantes)}d em atraso"
                : $"{a.DiasRestantes}d restantes";
            ws.Cell(r + 2, 6).Value = StatusLabel(a.Status);
        }

        ws.RangeUsed()!.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
        ws.RangeUsed()!.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
        ws.Row(1).Style.Font.Bold = true;
        ws.Columns().AdjustToContents();

        using var ms = new MemoryStream();
        workbook.SaveAs(ms);
        return ms.ToArray();
    }

    public byte[] ToXlsxDashboard(DashboardResultViewModel dashboard, IList<AlertaResultViewModel> alertas)
    {
        using var workbook = new XLWorkbook();

        var wsIndicadores = workbook.Worksheets.Add("Indicadores");
        wsIndicadores.Cell(1, 1).Value = "Indicador";
        wsIndicadores.Cell(1, 2).Value = "Valor";
        wsIndicadores.Row(1).Style.Font.Bold = true;

        var kpis = new[] { ("Total de Empresas", dashboard.TotalEmpresas), ("Obrigações do Mês", dashboard.TotalObrigacoesMes), ("Pendentes", dashboard.Pendentes), ("Atrasadas", dashboard.Atrasadas), ("Entregues", dashboard.Entregues) };

        for (var i = 0; i < kpis.Length; i++)
        {
            wsIndicadores.Cell(i + 2, 1).Value = kpis[i].Item1;
            wsIndicadores.Cell(i + 2, 2).Value = kpis[i].Item2;
        }

        wsIndicadores.Columns().AdjustToContents();

        var wsAlertas = workbook.Worksheets.Add("Alertas");
        var headers = AlertasCsvHeader;

        for (var c = 0; c < headers.Length; c++)
            wsAlertas.Cell(1, c + 1).Value = headers[c];

        for (var r = 0; r < alertas.Count; r++)
        {
            var a = alertas[r];
            wsAlertas.Cell(r + 2, 1).Value = a.RazaoSocial;
            wsAlertas.Cell(r + 2, 2).Value = a.CNPJ;
            wsAlertas.Cell(r + 2, 3).Value = a.TipoNome;
            wsAlertas.Cell(r + 2, 4).Value = a.DataVencimento.ToString("dd/MM/yyyy");
            wsAlertas.Cell(r + 2, 5).Value = a.DiasRestantes < 0
                ? $"{Math.Abs(a.DiasRestantes)}d em atraso"
                : $"{a.DiasRestantes}d restantes";
            wsAlertas.Cell(r + 2, 6).Value = StatusLabel(a.Status);
        }

        wsAlertas.RangeUsed()!.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
        wsAlertas.Row(1).Style.Font.Bold = true;
        wsAlertas.Columns().AdjustToContents();

        using var ms = new MemoryStream();
        workbook.SaveAs(ms);
        return ms.ToArray();
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
        => string.Join(";", fields.Select(f =>
        {
            var escaped = f.Replace("\"", "\"\"");
            if (escaped.Length > 0 && "+-=@".Contains(escaped[0]))
                escaped = "\t" + escaped;
            return $"\"{escaped}\"";
        }));
}

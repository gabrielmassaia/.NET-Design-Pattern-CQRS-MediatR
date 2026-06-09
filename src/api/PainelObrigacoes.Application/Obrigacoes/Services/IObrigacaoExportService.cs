using PainelObrigacoes.Application.Obrigacoes.ViewModels;

namespace PainelObrigacoes.Application.Obrigacoes.Services;

public interface IObrigacaoExportService
{
    byte[] ToCsv(IList<ObrigacaoResultViewModel> obrigacoes, int ano, int mes);
    byte[] ToPdf(IList<ObrigacaoResultViewModel> obrigacoes, int ano, int mes);
}

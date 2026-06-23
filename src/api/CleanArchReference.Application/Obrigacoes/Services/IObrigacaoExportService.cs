using CleanArchReference.Application.Obrigacoes.ViewModels;

namespace CleanArchReference.Application.Obrigacoes.Services;

public interface IObrigacaoExportService
{
    byte[] ToCsv(IList<ObrigacaoResultViewModel> obrigacoes, int ano, int mes);
    byte[] ToPdf(IList<ObrigacaoResultViewModel> obrigacoes, int ano, int mes);
    byte[] ToXlsx(IList<ObrigacaoResultViewModel> obrigacoes, int ano, int mes);
}

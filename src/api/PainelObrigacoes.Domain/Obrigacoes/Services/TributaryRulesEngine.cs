using PainelObrigacoes.Domain.Empresas.Models;
using PainelObrigacoes.Domain.Enums;
using PainelObrigacoes.Domain.Obrigacoes.Models;

namespace PainelObrigacoes.Domain.Obrigacoes.Services;

public sealed class TributaryRulesEngine : ITributaryRulesEngine
{
    private readonly IDueDateCalculator _calculator;

    public TributaryRulesEngine(IDueDateCalculator calculator) => _calculator = calculator;

    public IEnumerable<ObrigacaoModel> GenerateObrigacoes(EmpresaModel empresa, int ano, int mes)
    {
        var competencia = new DateTime(ano, mes, 1);
        var result = new List<ObrigacaoModel>();

        foreach (var tipo in GetMensais(empresa.Regime))
            result.Add(Build(empresa.Id, tipo, competencia, ano, mes));

        if (mes == 1)
            foreach (var tipo in GetAnuais(empresa.Regime))
                result.Add(Build(empresa.Id, tipo, competencia, ano, mes));

        return result;
    }

    public IEnumerable<ObrigacaoModel> GenerateAnoCompleto(EmpresaModel empresa, int ano)
    {
        var todas = new List<ObrigacaoModel>();
        for (int mes = 1; mes <= 12; mes++)
            todas.AddRange(GenerateObrigacoes(empresa, ano, mes));
        return todas;
    }

    private ObrigacaoModel Build(Guid empresaId, TipoObrigacao tipo,
        DateTime competencia, int ano, int mes) => new()
    {
        EmpresaId = empresaId,
        Tipo = tipo,
        Competencia = competencia,
        DataVencimento = _calculator.Calculate(tipo, ano, mes),
        Status = StatusObrigacao.Pendente
    };

    private static IEnumerable<TipoObrigacao> GetMensais(RegimeTributario regime)
        => regime switch
        {
            RegimeTributario.SimplesNacional => [TipoObrigacao.DAS, TipoObrigacao.eSocial],
            RegimeTributario.LucroPresumido or
            RegimeTributario.LucroReal => [
                TipoObrigacao.DCTF,
                TipoObrigacao.EFD_ICMS_IPI,
                TipoObrigacao.EFD_Contribuicoes,
                TipoObrigacao.EFD_Reinf,
                TipoObrigacao.eSocial],
            _ => []
        };

    private static IEnumerable<TipoObrigacao> GetAnuais(RegimeTributario regime)
        => regime switch
        {
            RegimeTributario.SimplesNacional => [
                TipoObrigacao.DEFIS, TipoObrigacao.DIRF, TipoObrigacao.RAIS],
            RegimeTributario.LucroPresumido or
            RegimeTributario.LucroReal => [
                TipoObrigacao.SPED_ECD, TipoObrigacao.SPED_ECF,
                TipoObrigacao.DIRF, TipoObrigacao.RAIS],
            _ => []
        };
}

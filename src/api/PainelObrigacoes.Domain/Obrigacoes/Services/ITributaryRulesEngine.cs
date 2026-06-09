using PainelObrigacoes.Domain.Empresas.Models;
using PainelObrigacoes.Domain.Obrigacoes.Models;

namespace PainelObrigacoes.Domain.Obrigacoes.Services;

public interface ITributaryRulesEngine
{
    IEnumerable<ObrigacaoModel> GenerateObrigacoes(EmpresaModel empresa, int ano, int mes);
    IEnumerable<ObrigacaoModel> GenerateAnoCompleto(EmpresaModel empresa, int ano);
}

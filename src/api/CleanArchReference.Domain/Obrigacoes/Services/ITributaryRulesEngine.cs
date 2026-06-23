using CleanArchReference.Domain.Empresas.Models;
using CleanArchReference.Domain.Obrigacoes.Models;

namespace CleanArchReference.Domain.Obrigacoes.Services;

public interface ITributaryRulesEngine
{
    IEnumerable<ObrigacaoModel> GenerateObrigacoes(EmpresaModel empresa, int ano, int mes);
    IEnumerable<ObrigacaoModel> GenerateAnoCompleto(EmpresaModel empresa, int ano);
}

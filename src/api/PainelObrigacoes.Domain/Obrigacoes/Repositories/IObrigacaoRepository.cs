using PainelObrigacoes.Domain.Dashboard.Models;
using PainelObrigacoes.Domain.Obrigacoes.Models;

namespace PainelObrigacoes.Domain.Obrigacoes.Repositories;

public interface IObrigacaoRepository
{
    Task<ObrigacaoModel?> FindByIdAsync(Guid id);
    Task<IList<ObrigacaoReadModel>> FindByEmpresaAndMonthAsync(Guid empresaId, int ano, int mes, int skip = 0, int take = 100);
    Task<IList<ObrigacaoReadModel>> FindEntreguesByEmpresaAsync(Guid empresaId);
    Task<IList<AlertaModel>> FindAlertasAsync(DateTime dataLimite, int limite = 50);
    Task<DashboardModel> GetDashboardCountsAsync(int ano, int mes);
    Task<bool> HasObrigacoesInYearAsync(Guid empresaId, int ano);
    void CreateRange(IEnumerable<ObrigacaoModel> models);
    void Update(ObrigacaoModel model);
    void AdicionarTag(Guid obrigacaoId, Guid tagId);
    void RemoverTag(Guid obrigacaoId, Guid tagId);
}

using PainelObrigacoes.Application.Obrigacoes.ViewModels;

namespace PainelObrigacoes.Application.Obrigacoes.Services;

public interface IObrigacaoAppService
{
    Task<IList<ObrigacaoResultViewModel>> FindAsync(FindObrigacoesViewModel viewModel, CancellationToken ct = default);
    Task<ObrigacaoResultViewModel> RegistrarEntregaAsync(Guid id, RegistrarEntregaViewModel viewModel, CancellationToken ct = default);
    Task<IList<ObrigacaoResultViewModel>> GetHistoricoAsync(Guid empresaId, CancellationToken ct = default);
    Task<(byte[] Content, string ContentType, string FileName)> ExportAsync(FindObrigacoesViewModel viewModel, string formato, CancellationToken ct = default);
}

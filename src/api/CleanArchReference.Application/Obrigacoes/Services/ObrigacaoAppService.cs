using AutoMapper;
using CleanArchReference.Application.Obrigacoes.ViewModels;
using CleanArchReference.Domain.Obrigacoes.Commands;
using CleanArchReference.Domain.Obrigacoes.Queries;
using CleanArchReference.Domain.Shared.Interfaces;

namespace CleanArchReference.Application.Obrigacoes.Services;

public sealed class ObrigacaoAppService : IObrigacaoAppService
{
    private readonly IMediatrService _mediator;
    private readonly IMapper _mapper;
    private readonly IObrigacaoExportService _exportService;

    public ObrigacaoAppService(IMediatrService mediator, IMapper mapper, IObrigacaoExportService exportService)
    {
        _mediator = mediator;
        _mapper = mapper;
        _exportService = exportService;
    }

    public async Task<IList<ObrigacaoResultViewModel>> FindAsync(
        FindObrigacoesViewModel viewModel, CancellationToken ct = default)
    {
        var query = _mapper.Map<FindObrigacoesQuery>(viewModel);
        var models = await _mediator.SendQuery(query, ct);
        return _mapper.Map<IList<ObrigacaoResultViewModel>>(models);
    }

    public async Task<ObrigacaoResultViewModel> RegistrarEntregaAsync(
        Guid id, RegistrarEntregaViewModel viewModel, CancellationToken ct = default)
    {
        var command = new RegistrarEntregaCommand { Id = id, DataEntrega = viewModel.DataEntrega };
        var model = await _mediator.SendCommand(command, ct);
        return _mapper.Map<ObrigacaoResultViewModel>(model);
    }

    public async Task<IList<ObrigacaoResultViewModel>> GetHistoricoAsync(
        Guid empresaId, CancellationToken ct = default)
    {
        var query = new GetHistoricoEmpresaQuery { EmpresaId = empresaId };
        var models = await _mediator.SendQuery(query, ct);
        return _mapper.Map<IList<ObrigacaoResultViewModel>>(models);
    }

    public async Task<(byte[] Content, string ContentType, string FileName)> ExportAsync(
        FindObrigacoesViewModel viewModel, string formato, CancellationToken ct = default)
    {
        var obrigacoes = await FindAsync(viewModel, ct);
        var mes = viewModel.Mes;
        var ano = viewModel.Ano;

        return formato.ToLowerInvariant() switch
        {
            "pdf"  => (_exportService.ToPdf(obrigacoes, ano, mes), "application/pdf", $"obrigacoes-{ano}-{mes:D2}.pdf"),
            "xlsx" => (_exportService.ToXlsx(obrigacoes, ano, mes), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"obrigacoes-{ano}-{mes:D2}.xlsx"),
            _      => (_exportService.ToCsv(obrigacoes, ano, mes), "text/csv", $"obrigacoes-{ano}-{mes:D2}.csv"),
        };
    }
}

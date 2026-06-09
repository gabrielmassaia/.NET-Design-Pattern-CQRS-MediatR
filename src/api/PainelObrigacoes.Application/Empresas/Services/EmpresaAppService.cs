using AutoMapper;
using PainelObrigacoes.Application.Empresas.ViewModels;
using PainelObrigacoes.Domain.Empresas.Commands;
using PainelObrigacoes.Domain.Empresas.Queries;
using PainelObrigacoes.Domain.Shared.Interfaces;

namespace PainelObrigacoes.Application.Empresas.Services;

public sealed class EmpresaAppService : IEmpresaAppService
{
    private readonly IMediatrService _mediator;
    private readonly IMapper _mapper;

    public EmpresaAppService(IMediatrService mediator, IMapper mapper)
    {
        _mediator = mediator;
        _mapper = mapper;
    }

    public async Task<IList<EmpresaResultViewModel>> FindAllAsync(int skip = 0, int take = 50, CancellationToken ct = default)
    {
        var models = await _mediator.SendQuery(new FindEmpresasQuery { Skip = skip, Take = take }, ct);
        return _mapper.Map<IList<EmpresaResultViewModel>>(models);
    }

    public async Task<EmpresaResultViewModel> CreateAsync(
        CreateEmpresaViewModel viewModel, CancellationToken ct = default)
    {
        var command = _mapper.Map<CreateEmpresaCommand>(viewModel);
        var model = await _mediator.SendCommand(command, ct);
        return _mapper.Map<EmpresaResultViewModel>(model);
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
        => _mediator.SendCommand(new DeleteEmpresaCommand { Id = id }, ct);

    public async Task<IList<EmpresaResultViewModel>> SearchAsync(string query, CancellationToken ct = default)
    {
        var q = new SearchEmpresasQuery { Query = query };
        var models = await _mediator.SendQuery(q, ct);
        return _mapper.Map<IList<EmpresaResultViewModel>>(models);
    }
}

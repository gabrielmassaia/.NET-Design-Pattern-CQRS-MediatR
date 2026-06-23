using AutoMapper;
using PainelObrigacoes.Application.Obrigacoes.ViewModels;
using PainelObrigacoes.Application.Tags.ViewModels;
using PainelObrigacoes.Domain.Shared.Interfaces;
using PainelObrigacoes.Domain.Tags.Commands;
using PainelObrigacoes.Domain.Tags.Queries;

namespace PainelObrigacoes.Application.Tags.Services;

public sealed class TagAppService : ITagAppService
{
    private readonly IMediatrService _mediator;
    private readonly IMapper _mapper;

    public TagAppService(IMediatrService mediator, IMapper mapper)
    {
        _mediator = mediator;
        _mapper = mapper;
    }

    public async Task<IList<TagResultViewModel>> FindAllAsync(CancellationToken ct = default)
    {
        var models = await _mediator.SendQuery(new FindTagsQuery(), ct);
        return _mapper.Map<IList<TagResultViewModel>>(models);
    }

    public async Task<TagResultViewModel> CreateAsync(CreateTagViewModel viewModel, CancellationToken ct = default)
    {
        var command = _mapper.Map<CreateTagCommand>(viewModel);
        var model = await _mediator.SendCommand(command, ct);
        return _mapper.Map<TagResultViewModel>(model);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var command = new DeleteTagCommand { Id = id };
        return await _mediator.SendCommand(command, ct);
    }

    public async Task<IList<TagResultViewModel>> FindByObrigacaoAsync(Guid obrigacaoId, CancellationToken ct = default)
    {
        var query = new FindTagsByObrigacaoQuery { ObrigacaoId = obrigacaoId };
        var models = await _mediator.SendQuery(query, ct);
        return _mapper.Map<IList<TagResultViewModel>>(models);
    }

    public async Task<ObrigacaoResultViewModel> VincularTagsAsync(Guid obrigacaoId, VincularTagsViewModel viewModel, CancellationToken ct = default)
    {
        var command = new VincularTagsCommand { ObrigacaoId = obrigacaoId, TagIds = viewModel.TagIds };
        var model = await _mediator.SendCommand(command, ct);
        return _mapper.Map<ObrigacaoResultViewModel>(model);
    }
}

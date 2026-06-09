using MediatR;
using PainelObrigacoes.Domain.Shared.Commands;
using PainelObrigacoes.Domain.Shared.Interfaces;
using PainelObrigacoes.Domain.Shared.Queries;

namespace PainelObrigacoes.Infrastructure.CrossCutting.IoC;

public sealed class MediatrService : IMediatrService
{
    private readonly IMediator _mediator;

    public MediatrService(IMediator mediator) => _mediator = mediator;

    public Task<TResult> SendCommand<TResult>(
        Command<TResult> command,
        CancellationToken cancellationToken = default)
        => _mediator.Send(command, cancellationToken);

    public Task<TResult> SendQuery<TResult>(
        Query<TResult> query,
        CancellationToken cancellationToken = default)
        => _mediator.Send(query, cancellationToken);
}

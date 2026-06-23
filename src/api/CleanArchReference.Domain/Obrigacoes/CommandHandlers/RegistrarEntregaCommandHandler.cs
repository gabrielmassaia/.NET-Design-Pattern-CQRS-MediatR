using MediatR;
using CleanArchReference.Domain.Enums;
using CleanArchReference.Domain.Obrigacoes.Commands;
using CleanArchReference.Domain.Obrigacoes.Events;
using CleanArchReference.Domain.Obrigacoes.Models;
using CleanArchReference.Domain.Obrigacoes.Repositories;
using CleanArchReference.Domain.Shared.Interfaces;

namespace CleanArchReference.Domain.Obrigacoes.CommandHandlers;

public sealed class RegistrarEntregaCommandHandler
    : IRequestHandler<RegistrarEntregaCommand, ObrigacaoModel>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IObrigacaoRepository _repository;
    private readonly IMediator _mediator;

    public RegistrarEntregaCommandHandler(IUnitOfWork unitOfWork, IObrigacaoRepository repository, IMediator mediator)
    {
        _unitOfWork = unitOfWork;
        _repository = repository;
        _mediator = mediator;
    }

    public async Task<ObrigacaoModel> Handle(
        RegistrarEntregaCommand command, CancellationToken cancellationToken)
    {
        var obrigacao = await _repository.FindByIdAsync(command.Id)
            ?? throw new KeyNotFoundException("Obrigação não encontrada.");

        if (obrigacao.DataEntrega.HasValue)
            throw new InvalidOperationException("Obrigação já foi marcada como entregue.");

        obrigacao.DataEntrega = command.DataEntrega ?? DateTime.UtcNow;
        obrigacao.Status = StatusObrigacao.Entregue;
        obrigacao.UpdatedAt = DateTime.UtcNow;

        _repository.Update(obrigacao);
        await _unitOfWork.CompleteAsync(cancellationToken);

        await _mediator.Publish(
            new ObrigacaoEntregueEvent(obrigacao.Id), cancellationToken);

        return obrigacao;
    }
}

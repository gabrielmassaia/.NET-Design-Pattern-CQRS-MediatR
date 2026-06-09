using MediatR;
using PainelObrigacoes.Domain.Empresas.Commands;
using PainelObrigacoes.Domain.Empresas.Events;
using PainelObrigacoes.Domain.Empresas.Repositories;
using PainelObrigacoes.Domain.Shared.Interfaces;

namespace PainelObrigacoes.Domain.Empresas.CommandHandlers;

public sealed class DeleteEmpresaCommandHandler
    : IRequestHandler<DeleteEmpresaCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmpresaRepository _empresaRepository;
    private readonly IMediator _mediator;

    public DeleteEmpresaCommandHandler(
        IUnitOfWork unitOfWork,
        IEmpresaRepository empresaRepository,
        IMediator mediator)
    {
        _unitOfWork = unitOfWork;
        _empresaRepository = empresaRepository;
        _mediator = mediator;
    }

    public async Task<bool> Handle(
        DeleteEmpresaCommand command, CancellationToken cancellationToken)
    {
        var empresa = await _empresaRepository.FindByIdAsync(command.Id)
            ?? throw new KeyNotFoundException("Empresa não encontrada.");

        _empresaRepository.Delete(empresa);

        await _unitOfWork.CompleteAsync(cancellationToken);

        await _mediator.Publish(
            new EmpresaDeletedEvent(empresa.Id), cancellationToken);

        return true;
    }
}

using MediatR;
using CleanArchReference.Domain.Empresas.Commands;
using CleanArchReference.Domain.Empresas.Events;
using CleanArchReference.Domain.Empresas.Repositories;
using CleanArchReference.Domain.Shared.Interfaces;

namespace CleanArchReference.Domain.Empresas.CommandHandlers;

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

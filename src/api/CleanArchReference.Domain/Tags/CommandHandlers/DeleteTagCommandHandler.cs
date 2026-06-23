using MediatR;
using CleanArchReference.Domain.Shared.Interfaces;
using CleanArchReference.Domain.Tags.Commands;
using CleanArchReference.Domain.Tags.Repositories;

namespace CleanArchReference.Domain.Tags.CommandHandlers;

public sealed class DeleteTagCommandHandler : IRequestHandler<DeleteTagCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITagRepository _repository;

    public DeleteTagCommandHandler(IUnitOfWork unitOfWork, ITagRepository repository)
    {
        _unitOfWork = unitOfWork;
        _repository = repository;
    }

    public async Task<bool> Handle(DeleteTagCommand command, CancellationToken cancellationToken)
    {
        var tag = await _repository.FindByIdAsync(command.Id)
            ?? throw new KeyNotFoundException("Tag não encontrada.");

        _repository.Delete(tag);
        await _unitOfWork.CompleteAsync(cancellationToken);
        return true;
    }
}

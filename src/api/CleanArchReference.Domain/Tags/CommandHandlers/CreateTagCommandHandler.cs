using MediatR;
using CleanArchReference.Domain.Shared.Interfaces;
using CleanArchReference.Domain.Tags.Commands;
using CleanArchReference.Domain.Tags.Events;
using CleanArchReference.Domain.Tags.Models;
using CleanArchReference.Domain.Tags.Repositories;

namespace CleanArchReference.Domain.Tags.CommandHandlers;

public sealed class CreateTagCommandHandler : IRequestHandler<CreateTagCommand, TagModel>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITagRepository _repository;
    private readonly IMediator _mediator;

    public CreateTagCommandHandler(IUnitOfWork unitOfWork, ITagRepository repository, IMediator mediator)
    {
        _unitOfWork = unitOfWork;
        _repository = repository;
        _mediator = mediator;
    }

    public async Task<TagModel> Handle(CreateTagCommand command, CancellationToken cancellationToken)
    {
        var model = command.ToModel();
        _repository.Create(model);
        await _unitOfWork.CompleteAsync(cancellationToken);
        await _mediator.Publish(new TagCriadaEvent(model.Id), cancellationToken);
        return model;
    }
}

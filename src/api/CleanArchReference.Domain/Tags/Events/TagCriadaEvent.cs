using MediatR;

namespace CleanArchReference.Domain.Tags.Events;

public sealed record TagCriadaEvent(Guid TagId) : INotification;

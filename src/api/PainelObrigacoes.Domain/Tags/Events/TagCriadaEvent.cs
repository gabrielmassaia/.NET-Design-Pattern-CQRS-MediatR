using MediatR;

namespace PainelObrigacoes.Domain.Tags.Events;

public sealed record TagCriadaEvent(Guid TagId) : INotification;

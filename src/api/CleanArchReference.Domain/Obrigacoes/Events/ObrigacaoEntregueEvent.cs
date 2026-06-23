using MediatR;

namespace CleanArchReference.Domain.Obrigacoes.Events;

public sealed record ObrigacaoEntregueEvent(Guid ObrigacaoId) : INotification;

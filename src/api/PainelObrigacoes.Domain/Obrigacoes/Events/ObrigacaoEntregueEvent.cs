using MediatR;

namespace PainelObrigacoes.Domain.Obrigacoes.Events;

public sealed record ObrigacaoEntregueEvent(Guid ObrigacaoId) : INotification;

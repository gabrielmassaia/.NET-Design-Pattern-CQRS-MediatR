using MediatR;

namespace PainelObrigacoes.Domain.Empresas.Events;

public sealed record EmpresaDeletedEvent(Guid EmpresaId) : INotification;

using MediatR;

namespace CleanArchReference.Domain.Empresas.Events;

public sealed record EmpresaDeletedEvent(Guid EmpresaId) : INotification;

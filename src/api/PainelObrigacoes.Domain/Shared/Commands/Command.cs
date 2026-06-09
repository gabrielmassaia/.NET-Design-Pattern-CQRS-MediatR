using MediatR;

namespace PainelObrigacoes.Domain.Shared.Commands;

public abstract class Command<TResult> : IRequest<TResult> { }

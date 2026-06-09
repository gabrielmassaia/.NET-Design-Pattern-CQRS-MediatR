using MediatR;

namespace PainelObrigacoes.Domain.Shared.Queries;

public abstract class Query<TResult> : IRequest<TResult> { }

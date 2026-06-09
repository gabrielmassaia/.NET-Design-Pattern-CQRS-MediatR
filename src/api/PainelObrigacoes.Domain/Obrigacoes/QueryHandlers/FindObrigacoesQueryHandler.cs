using MediatR;
using PainelObrigacoes.Domain.Enums;
using PainelObrigacoes.Domain.Obrigacoes.Models;
using PainelObrigacoes.Domain.Obrigacoes.Queries;
using PainelObrigacoes.Domain.Obrigacoes.Repositories;

namespace PainelObrigacoes.Domain.Obrigacoes.QueryHandlers;

public sealed class FindObrigacoesQueryHandler
    : IRequestHandler<FindObrigacoesQuery, IList<ObrigacaoReadModel>>
{
    private readonly IObrigacaoRepository _repository;

    public FindObrigacoesQueryHandler(IObrigacaoRepository repository)
        => _repository = repository;

    public async Task<IList<ObrigacaoReadModel>> Handle(
        FindObrigacoesQuery query, CancellationToken cancellationToken)
    {
        var obrigacoes = await _repository.FindByEmpresaAndMonthAsync(
            query.EmpresaId, query.Ano, query.Mes, query.Skip, query.Take);

        var hoje = DateTime.UtcNow.Date;
        foreach (var o in obrigacoes)
        {
            o.Status = o.DataEntrega.HasValue
                ? StatusObrigacao.Entregue
                : o.DataVencimento.Date < hoje
                    ? StatusObrigacao.Atrasada
                    : StatusObrigacao.Pendente;
        }

        return obrigacoes;
    }
}

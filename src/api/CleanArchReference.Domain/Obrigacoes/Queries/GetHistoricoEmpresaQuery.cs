using CleanArchReference.Domain.Obrigacoes.Models;
using CleanArchReference.Domain.Shared.Queries;

namespace CleanArchReference.Domain.Obrigacoes.Queries;

public sealed class GetHistoricoEmpresaQuery : Query<IList<ObrigacaoReadModel>>
{
    public Guid EmpresaId { get; set; }
}

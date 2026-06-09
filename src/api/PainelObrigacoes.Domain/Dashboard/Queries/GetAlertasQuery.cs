using PainelObrigacoes.Domain.Dashboard.Models;
using PainelObrigacoes.Domain.Shared.Queries;

namespace PainelObrigacoes.Domain.Dashboard.Queries;

public sealed class GetAlertasQuery : Query<IList<AlertaModel>> { }

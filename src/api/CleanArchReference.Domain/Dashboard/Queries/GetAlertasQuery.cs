using CleanArchReference.Domain.Dashboard.Models;
using CleanArchReference.Domain.Shared.Queries;

namespace CleanArchReference.Domain.Dashboard.Queries;

public sealed class GetAlertasQuery : Query<IList<AlertaModel>> { }

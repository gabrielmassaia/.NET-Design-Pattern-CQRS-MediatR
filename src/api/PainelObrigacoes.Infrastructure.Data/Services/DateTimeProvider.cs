using PainelObrigacoes.Domain.Shared.Interfaces;

namespace PainelObrigacoes.Infrastructure.Data.Services;

public sealed class DateTimeProvider : IDateTimeProvider
{
    public DateTime UtcNow => DateTime.UtcNow;
    public int CurrentYear => DateTime.UtcNow.Year;
    public int CurrentMonth => DateTime.UtcNow.Month;
}

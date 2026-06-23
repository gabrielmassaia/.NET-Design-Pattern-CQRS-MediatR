using CleanArchReference.Domain.Shared.Interfaces;

namespace CleanArchReference.Infrastructure.Data.Services;

public sealed class DateTimeProvider : IDateTimeProvider
{
    public DateTime UtcNow => DateTime.UtcNow;
    public int CurrentYear => DateTime.UtcNow.Year;
    public int CurrentMonth => DateTime.UtcNow.Month;
}

namespace CleanArchReference.Domain.Obrigacoes.Services;

public interface IHolidayProvider
{
    bool IsHoliday(DateTime date);
    IReadOnlySet<DateTime> GetHolidays(int year);
}

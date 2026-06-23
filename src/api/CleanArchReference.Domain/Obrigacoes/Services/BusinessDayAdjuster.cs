namespace CleanArchReference.Domain.Obrigacoes.Services;

public sealed class BusinessDayAdjuster : IBusinessDayAdjuster
{
    private readonly IHolidayProvider _holidayProvider;

    public BusinessDayAdjuster(IHolidayProvider holidayProvider)
    {
        _holidayProvider = holidayProvider;
    }

    public DateTime Adjust(DateTime date)
    {
        var adjusted = date;
        while (IsNonBusinessDay(adjusted))
            adjusted = adjusted.AddDays(1);
        return adjusted;
    }

    private bool IsNonBusinessDay(DateTime date) => date.DayOfWeek switch
    {
        DayOfWeek.Saturday => true,
        DayOfWeek.Sunday   => true,
        _                  => _holidayProvider.IsHoliday(date)
    };
}

namespace PainelObrigacoes.Domain.Obrigacoes.Services;

public sealed class BrazilianHolidayProvider : IHolidayProvider
{
    private static readonly HashSet<(int Month, int Day)> _fixedHolidays =
    [
        (1, 1),   // Confraternização Universal
        (4, 21),  // Tiradentes
        (5, 1),   // Dia do Trabalho
        (9, 7),   // Independência
        (10, 12), // Nossa Sra. Aparecida
        (11, 2),  // Finados
        (11, 15), // Proclamação da República
        (12, 25), // Natal
    ];

    public bool IsHoliday(DateTime date)
    {
        if (_fixedHolidays.Contains((date.Month, date.Day)))
            return true;

        var movable = GetMovableHolidays(date.Year);
        return movable.Contains(date.Date);
    }

    public IReadOnlySet<DateTime> GetHolidays(int year)
    {
        var holidays = new HashSet<DateTime>();
        foreach (var (month, day) in _fixedHolidays)
            holidays.Add(new DateTime(year, month, day));
        foreach (var date in GetMovableHolidays(year))
            holidays.Add(date.Date);
        return holidays;
    }

    private static HashSet<DateTime> GetMovableHolidays(int year)
    {
        var easter = CalculateEaster(year);
        var results = new HashSet<DateTime>
        {
            easter.AddDays(-47), // Carnaval (terça, 47 dias antes da Páscoa)
            easter.AddDays(-46), // Carnaval (segunda)
            easter.AddDays(-2),  // Sexta-Feira Santa
            easter,              // Páscoa
            easter.AddDays(60),  // Corpus Christi
        };
        return results;
    }

    private static DateTime CalculateEaster(int year)
    {
        // Algoritmo de Gauss para calcular a Páscoa
        int a = year % 19;
        int b = year / 100;
        int c = year % 100;
        int d = b / 4;
        int e = b % 4;
        int f = (b + 8) / 25;
        int g = (b - f + 1) / 3;
        int h = (19 * a + b - d - g + 15) % 30;
        int i = c / 4;
        int k = c % 4;
        int l = (32 + 2 * e + 2 * i - h - k) % 7;
        int m = (a + 11 * h + 22 * l) / 451;
        int month = (h + l - 7 * m + 114) / 31;
        int day = ((h + l - 7 * m + 114) % 31) + 1;
        return new DateTime(year, month, day);
    }
}

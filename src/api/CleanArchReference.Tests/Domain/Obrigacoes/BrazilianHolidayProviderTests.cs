using FluentAssertions;
using CleanArchReference.Domain.Obrigacoes.Services;
using Xunit;

namespace CleanArchReference.Tests.Domain.Obrigacoes;

public class BrazilianHolidayProviderTests
{
    private readonly BrazilianHolidayProvider _provider = new();

    [Fact]
    public void Natal_25Dezembro_DeveSerFeriado()
        => _provider.IsHoliday(new DateTime(2024, 12, 25)).Should().BeTrue();

    [Fact]
    public void Tiradentes_21Abril_DeveSerFeriado()
        => _provider.IsHoliday(new DateTime(2024, 4, 21)).Should().BeTrue();

    [Fact]
    public void Independencia_7Setembro_DeveSerFeriado()
        => _provider.IsHoliday(new DateTime(2024, 9, 7)).Should().BeTrue();

    [Fact]
    public void Proclamacao_15Novembro_DeveSerFeriado()
        => _provider.IsHoliday(new DateTime(2024, 11, 15)).Should().BeTrue();

    [Fact]
    public void Finados_2Novembro_DeveSerFeriado()
        => _provider.IsHoliday(new DateTime(2024, 11, 2)).Should().BeTrue();

    [Fact]
    public void Carnaval_2024_DeveSerFeriado()
        => _provider.IsHoliday(new DateTime(2024, 2, 13)).Should().BeTrue();

    [Fact]
    public void SextaFeiraSanta_2024_DeveSerFeriado()
        => _provider.IsHoliday(new DateTime(2024, 3, 29)).Should().BeTrue();

    [Fact]
    public void CorpusChristi_2024_DeveSerFeriado()
        => _provider.IsHoliday(new DateTime(2024, 5, 30)).Should().BeTrue();

    [Fact]
    public void DiaNaoFeriado_NaoDeveRetornarComoFeriado()
        => _provider.IsHoliday(new DateTime(2024, 6, 15)).Should().BeFalse();

    [Fact]
    public void Domingo_NaoDeveSerConsideradoApenasPeloProvider()
        => _provider.IsHoliday(new DateTime(2024, 6, 16)).Should().BeFalse();

    [Fact]
    public void GetHolidays_2024_DeveConterFeriadosFixosEMoveis()
    {
        var holidays = _provider.GetHolidays(2024);

        holidays.Should().Contain(new DateTime(2024, 12, 25)); // Natal
        holidays.Should().Contain(new DateTime(2024, 4, 21));  // Tiradentes
        holidays.Should().Contain(new DateTime(2024, 2, 13));  // Carnaval
        holidays.Should().Contain(new DateTime(2024, 3, 29));  // Sexta-Feira Santa
        holidays.Should().Contain(new DateTime(2024, 5, 30));  // Corpus Christi
        holidays.Should().HaveCount(13); // 8 fixos + 5 móveis (carnaval seg/ter, sexta santa, pascoa, corpus christi)
    }
}

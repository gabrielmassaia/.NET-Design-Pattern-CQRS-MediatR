using FluentAssertions;
using PainelObrigacoes.Domain.Obrigacoes.Services;
using Moq;

namespace PainelObrigacoes.Tests.Domain.Obrigacoes;

public class BusinessDayAdjusterTests
{
    private readonly Mock<IHolidayProvider> _holidayMock = new();
    private readonly BusinessDayAdjuster _sut;

    public BusinessDayAdjusterTests()
    {
        _holidayMock.Setup(h => h.IsHoliday(It.IsAny<DateTime>())).Returns(false);
        _sut = new BusinessDayAdjuster(_holidayMock.Object);
    }

    [Fact]
    public void Ajustar_DiaUtil_NaoAlteraData()
    {
        var data = new DateTime(2024, 6, 10);
        var result = _sut.Adjust(data);

        result.Should().Be(data);
    }

    [Fact]
    public void Ajustar_Sabado_AvancaParaSegunda()
    {
        var sabado = new DateTime(2024, 6, 8);
        var result = _sut.Adjust(sabado);

        result.Should().Be(new DateTime(2024, 6, 10));
        result.DayOfWeek.Should().Be(DayOfWeek.Monday);
    }

    [Fact]
    public void Ajustar_Domingo_AvancaParaSegunda()
    {
        var domingo = new DateTime(2024, 6, 9);
        var result = _sut.Adjust(domingo);

        result.Should().Be(new DateTime(2024, 6, 10));
        result.DayOfWeek.Should().Be(DayOfWeek.Monday);
    }

    [Fact]
    public void Ajustar_Sexta_NaoAltera()
    {
        var sexta = new DateTime(2024, 6, 7);
        var result = _sut.Adjust(sexta);

        result.Should().Be(sexta);
        result.DayOfWeek.Should().Be(DayOfWeek.Friday);
    }

    [Fact]
    public void Ajustar_Feriado_AvancaParaProximoDiaUtil()
    {
        _holidayMock.Setup(h => h.IsHoliday(new DateTime(2024, 12, 25))).Returns(true);
        _holidayMock.Setup(h => h.IsHoliday(new DateTime(2024, 12, 26))).Returns(false);

        var natal = new DateTime(2024, 12, 25);
        var result = _sut.Adjust(natal);

        result.Should().Be(new DateTime(2024, 12, 26));
    }

    [Fact]
    public void Ajustar_FeriadoEmSexta_NaoAvancaAlemDeSegunda()
    {
        _holidayMock.Setup(h => h.IsHoliday(new DateTime(2024, 11, 15))).Returns(true);
        _holidayMock.Setup(h => h.IsHoliday(new DateTime(2024, 11, 16))).Returns(false);
        _holidayMock.Setup(h => h.IsHoliday(new DateTime(2024, 11, 17))).Returns(false);
        _holidayMock.Setup(h => h.IsHoliday(new DateTime(2024, 11, 18))).Returns(false);

        var sexta = new DateTime(2024, 11, 15);
        var result = _sut.Adjust(sexta);

        result.Should().Be(new DateTime(2024, 11, 18));
        result.DayOfWeek.Should().Be(DayOfWeek.Monday);
    }

    [Fact]
    public void Ajustar_FeriadoNoSabado_AvancaParaSegunda()
    {
        _holidayMock.Setup(h => h.IsHoliday(new DateTime(2024, 11, 16))).Returns(false);
        _holidayMock.Setup(h => h.IsHoliday(new DateTime(2024, 11, 18))).Returns(false);

        var sabado = new DateTime(2024, 11, 16);
        var result = _sut.Adjust(sabado);

        result.Should().Be(new DateTime(2024, 11, 18));
    }

    [Fact]
    public void Ajustar_FeriadoNoDomingo_AvancaParaSegunda()
    {
        _holidayMock.Setup(h => h.IsHoliday(new DateTime(2024, 11, 17))).Returns(false);
        _holidayMock.Setup(h => h.IsHoliday(new DateTime(2024, 11, 18))).Returns(false);

        var domingo = new DateTime(2024, 11, 17);
        var result = _sut.Adjust(domingo);

        result.Should().Be(new DateTime(2024, 11, 18));
    }

    [Fact]
    public void Ajustar_ComHolidayProviderReal_UsaFeriadosBrasileiros()
    {
        var provider = new BrazilianHolidayProvider();
        var adjuster = new BusinessDayAdjuster(provider);

        var dataNatal = new DateTime(2024, 12, 25);
        var result = adjuster.Adjust(dataNatal);

        result.Should().Be(new DateTime(2024, 12, 26));
    }
}

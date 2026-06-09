using PainelObrigacoes.Domain.Enums;

namespace PainelObrigacoes.Domain.Obrigacoes.Services;

public sealed class DueDateCalculator : IDueDateCalculator
{
    private readonly IBusinessDayAdjuster _adjuster;

    public DueDateCalculator(IBusinessDayAdjuster adjuster) => _adjuster = adjuster;

    public DateTime Calculate(TipoObrigacao tipo, int ano, int mes) => tipo switch
    {
        TipoObrigacao.DAS =>
            _adjuster.Adjust(new DateTime(ano, mes, 1).AddMonths(1).AddDays(19)),
        TipoObrigacao.DCTF =>
            new DateTime(ano, mes, 1).AddMonths(2).AddDays(14),
        TipoObrigacao.EFD_ICMS_IPI or
        TipoObrigacao.EFD_Contribuicoes or
        TipoObrigacao.EFD_Reinf =>
            new DateTime(ano, mes, 1).AddMonths(1).AddDays(14),
        TipoObrigacao.eSocial =>
            new DateTime(ano, mes, 1).AddMonths(1).AddDays(6),
        TipoObrigacao.SPED_ECD => new DateTime(ano + 1, 5, 31),
        TipoObrigacao.SPED_ECF => new DateTime(ano + 1, 7, 31),
        TipoObrigacao.DIRF     => new DateTime(ano + 1, 3, 1).AddDays(-1),
        TipoObrigacao.RAIS     => new DateTime(ano + 1, 3, 31),
        TipoObrigacao.DEFIS    => new DateTime(ano + 1, 3, 31),
        _ => throw new ArgumentOutOfRangeException(nameof(tipo), $"Tipo não mapeado: {tipo}")
    };
}

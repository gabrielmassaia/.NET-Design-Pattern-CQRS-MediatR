using PainelObrigacoes.Domain.Enums;

namespace PainelObrigacoes.Domain.Obrigacoes.Services;

public interface IDueDateCalculator
{
    DateTime Calculate(TipoObrigacao tipo, int anoCompetencia, int mesCompetencia);
}

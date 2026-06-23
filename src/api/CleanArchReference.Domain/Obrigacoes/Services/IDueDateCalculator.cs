using CleanArchReference.Domain.Enums;

namespace CleanArchReference.Domain.Obrigacoes.Services;

public interface IDueDateCalculator
{
    DateTime Calculate(TipoObrigacao tipo, int anoCompetencia, int mesCompetencia);
}

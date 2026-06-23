namespace CleanArchReference.Domain.Obrigacoes.Services;

public interface IBusinessDayAdjuster
{
    DateTime Adjust(DateTime date);
}

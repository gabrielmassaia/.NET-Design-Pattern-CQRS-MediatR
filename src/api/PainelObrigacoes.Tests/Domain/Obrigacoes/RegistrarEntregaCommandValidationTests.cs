using FluentValidation.TestHelper;
using PainelObrigacoes.Domain.Obrigacoes.Commands;
using PainelObrigacoes.Domain.Obrigacoes.Validations;

namespace PainelObrigacoes.Tests.Domain.Obrigacoes;

public class RegistrarEntregaCommandValidationTests
{
    private readonly RegistrarEntregaCommandValidation _validator = new();

    [Fact]
    public void Id_Vazio_DeveFalhar()
    {
        var command = new RegistrarEntregaCommand { Id = Guid.Empty, DataEntrega = DateTime.UtcNow };

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(c => c.Id);
    }

    [Fact]
    public void Id_Valido_DevePassar()
    {
        var command = new RegistrarEntregaCommand { Id = Guid.NewGuid(), DataEntrega = DateTime.UtcNow };

        var result = _validator.TestValidate(command);

        result.ShouldNotHaveValidationErrorFor(c => c.Id);
    }

    [Fact]
    public void DataEntrega_Futura_DeveFalhar()
    {
        var command = new RegistrarEntregaCommand { Id = Guid.NewGuid(), DataEntrega = DateTime.UtcNow.AddDays(10) };

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(c => c.DataEntrega);
    }

    [Fact]
    public void DataEntrega_SemValor_DevePassar()
    {
        var command = new RegistrarEntregaCommand { Id = Guid.NewGuid(), DataEntrega = null };

        var result = _validator.TestValidate(command);

        result.ShouldNotHaveValidationErrorFor(c => c.DataEntrega);
    }
}

using FluentValidation.TestHelper;
using PainelObrigacoes.Domain.Empresas.Commands;
using PainelObrigacoes.Domain.Empresas.Validations;
using PainelObrigacoes.Domain.Enums;

namespace PainelObrigacoes.Tests.Domain.Empresas;

public class CreateEmpresaCommandValidationTests
{
    private readonly CreateEmpresaCommandValidation _validator = new();

    [Fact]
    public void CNPJ_Invalido_DeveFalhar()
    {
        var command = new CreateEmpresaCommand { CNPJ = "123", RazaoSocial = "Empresa", Regime = RegimeTributario.SimplesNacional };

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(c => c.CNPJ);
    }

    [Fact]
    public void CNPJ_Valido_DevePassar()
    {
        var command = new CreateEmpresaCommand { CNPJ = "11222333000181", RazaoSocial = "Empresa Teste Ltda", Regime = RegimeTributario.SimplesNacional };

        var result = _validator.TestValidate(command);

        result.ShouldNotHaveValidationErrorFor(c => c.CNPJ);
    }

    [Fact]
    public void RazaoSocial_Vazia_DeveFalhar()
    {
        var command = new CreateEmpresaCommand { CNPJ = "11222333000181", RazaoSocial = "", Regime = RegimeTributario.SimplesNacional };

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(c => c.RazaoSocial);
    }

    [Fact]
    public void Regime_Invalido_DeveFalhar()
    {
        var command = new CreateEmpresaCommand { CNPJ = "11222333000181", RazaoSocial = "Empresa", Regime = (RegimeTributario)99 };

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(c => c.Regime);
    }
}

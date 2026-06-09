using FluentValidation.TestHelper;
using PainelObrigacoes.Domain.Obrigacoes.Queries;
using PainelObrigacoes.Domain.Obrigacoes.Validations;

namespace PainelObrigacoes.Tests.Domain.Obrigacoes;

public class FindObrigacoesQueryValidationTests
{
    private readonly FindObrigacoesQueryValidation _validator = new();

    [Fact]
    public void EmpresaId_Vazio_DeveFalhar()
    {
        var query = new FindObrigacoesQuery { EmpresaId = Guid.Empty, Ano = 2024, Mes = 1 };

        var result = _validator.TestValidate(query);

        result.ShouldHaveValidationErrorFor(q => q.EmpresaId);
    }

    [Fact]
    public void Ano_ForaDoRange_DeveFalhar()
    {
        var query = new FindObrigacoesQuery { EmpresaId = Guid.NewGuid(), Ano = 2019, Mes = 1 };

        var result = _validator.TestValidate(query);

        result.ShouldHaveValidationErrorFor(q => q.Ano);
    }

    [Fact]
    public void Mes_ForaDoRange_DeveFalhar()
    {
        var query = new FindObrigacoesQuery { EmpresaId = Guid.NewGuid(), Ano = 2024, Mes = 13 };

        var result = _validator.TestValidate(query);

        result.ShouldHaveValidationErrorFor(q => q.Mes);
    }

    [Fact]
    public void DadosValidos_DevePassar()
    {
        var query = new FindObrigacoesQuery { EmpresaId = Guid.NewGuid(), Ano = 2024, Mes = 6 };

        var result = _validator.TestValidate(query);

        result.ShouldNotHaveAnyValidationErrors();
    }
}

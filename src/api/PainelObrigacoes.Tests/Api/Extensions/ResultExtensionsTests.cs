using FluentAssertions;
using PainelObrigacoes.Api.Extensions;
using PainelObrigacoes.Shared.ResponseData;

namespace PainelObrigacoes.Tests.Api.Extensions;

public class ResultExtensionsTests
{
    [Fact]
    public void ToOkResponse_DeveCriarResponseComData()
    {
        var data = "teste";
        var result = data.ToOkResponse();

        result.Should().NotBeNull();
    }

    [Fact]
    public void ToMinimalApiResult_ResponseSucesso_DeveRetornarOk()
    {
        var response = ResponseData<string>.Ok("dados");
        var result = response.ToMinimalApiResult();

        result.Should().NotBeNull();
    }

    [Fact]
    public void ToMinimalApiResult_ResponseNotFound_DeveRetornarNotFound()
    {
        var response = ResponseData<string>.Fail("Não encontrado", ResponseErrorCode.NotFound);
        var result = response.ToMinimalApiResult();

        result.Should().NotBeNull();
    }

    [Fact]
    public void ToMinimalApiResult_ResponseConflict_DeveRetornarConflict()
    {
        var response = ResponseData<string>.Fail("Conflito", ResponseErrorCode.Conflict);
        var result = response.ToMinimalApiResult();

        result.Should().NotBeNull();
    }

    [Fact]
    public void ToMinimalApiResult_ResponseValidation_DeveRetornarBadRequest()
    {
        var response = ResponseData<string>.Fail("Inválido", ResponseErrorCode.Validation);
        var result = response.ToMinimalApiResult();

        result.Should().NotBeNull();
    }
}

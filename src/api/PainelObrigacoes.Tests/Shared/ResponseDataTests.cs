using FluentAssertions;
using PainelObrigacoes.Shared.ResponseData;

namespace PainelObrigacoes.Tests.Shared;

public class ResponseDataTests
{
    [Fact]
    public void Ok_DeveCriarRespostaDeSucesso()
    {
        var result = ResponseData<string>.Ok("dados");

        result.Success.Should().BeTrue();
        result.Data.Should().Be("dados");
        result.Message.Should().BeEmpty();
        result.ErrorCode.Should().BeNull();
    }

    [Fact]
    public void Ok_ComMensagem_DeveConterMensagem()
    {
        var result = ResponseData<int>.Ok(42, "Sucesso");

        result.Success.Should().BeTrue();
        result.Data.Should().Be(42);
        result.Message.Should().Be("Sucesso");
    }

    [Fact]
    public void Fail_DeveCriarRespostaDeErro()
    {
        var result = ResponseData<object>.Fail("Erro ocorreu");

        result.Success.Should().BeFalse();
        result.Message.Should().Be("Erro ocorreu");
        result.Data.Should().BeNull();
        result.ErrorCode.Should().Be(ResponseErrorCode.Unknown);
    }

    [Fact]
    public void Fail_ComErrorCode_DeveConterCodigoEspecifico()
    {
        var result = ResponseData<object>.Fail("Não encontrado", ResponseErrorCode.NotFound);

        result.Success.Should().BeFalse();
        result.Message.Should().Be("Não encontrado");
        result.ErrorCode.Should().Be(ResponseErrorCode.NotFound);
    }

    [Fact]
    public void Ok_ComObjetoComplexo_DeveManterPropriedades()
    {
        var obj = new { Id = 1, Nome = "Teste" };
        var result = ResponseData<object>.Ok(obj);

        result.Data.Should().Be(obj);
    }
}

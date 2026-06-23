// ============================================================
// 🔴 FASE 5.4 — ResultExtensions (Helper do Endpoint)
// ============================================================
//
// Responsabilidade: "Envelopa qualquer resultado no padrão ResponseData"
//
// ToOkResponse<T>(this T data):
//   Pega qualquer objeto e coloca dentro de ResponseData.Ok()
//   Ex: EmpresaResultViewModel → { success: true, data: { ... } }
//
// Usado no endpoint:
//   return result.ToOkResponse();
//   // vira: Results.Ok(ResponseData<EmpresaResultViewModel>.Ok(result))
// ============================================================

using PainelObrigacoes.Shared.ResponseData;

namespace PainelObrigacoes.Api.Extensions;

public static class ResultExtensions
{
    // ToOkResponse: transforma qualquer dado em uma resposta 200 OK padronizada
    // O ResponseData envelope serve pra:
    //   1. Frontend sempre saber o formato da resposta
    //   2. Ter metadata (success, message, errorCode) sem poluir o data
    //   3. Tratamento de erro padronizado
    public static IResult ToOkResponse<T>(this T data)
        => Results.Ok(ResponseData<T>.Ok(data));

    // ToMinimalApiResult: retorna status code apropriado baseado no ErrorCode
    // (usado em outros endpoints, prepare-se pra conhecer)
    public static IResult ToMinimalApiResult<T>(this ResponseData<T> response)
    {
        if (response.Success)
            return Results.Ok(response);

        return response.ErrorCode switch
        {
            ResponseErrorCode.NotFound => Results.NotFound(response),
            ResponseErrorCode.Conflict => Results.Conflict(response),
            ResponseErrorCode.Validation => Results.BadRequest(response),
            _ => Results.BadRequest(response)
        };
    }
}

using PainelObrigacoes.Shared.ResponseData;

namespace PainelObrigacoes.Api.Extensions;

public static class ResultExtensions
{
    public static IResult ToOkResponse<T>(this T data)
        => Results.Ok(ResponseData<T>.Ok(data));

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

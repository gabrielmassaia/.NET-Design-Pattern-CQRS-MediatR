namespace PainelObrigacoes.Shared.ResponseData;

public class ResponseData<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public ResponseErrorCode? ErrorCode { get; set; }

    public static ResponseData<T> Ok(T data, string message = "")
        => new() { Success = true, Message = message, Data = data };

    public static ResponseData<T> Fail(string message, ResponseErrorCode errorCode = ResponseErrorCode.Unknown)
        => new() { Success = false, Message = message, ErrorCode = errorCode };
}

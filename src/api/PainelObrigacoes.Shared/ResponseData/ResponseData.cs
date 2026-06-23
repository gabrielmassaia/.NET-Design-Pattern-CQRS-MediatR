// ============================================================
// 🔴 FASE 5.2 — ResponseData (Envelope Padrão de Resposta)
// ============================================================
//
// Responsabilidade: "Toda resposta da API segue esse formato"
//
// TODA resposta da API é envelopada nessa classe:
//
// Sucesso:
//   { "success": true, "message": "", "data": { ... }, "errorCode": null }
//
// Erro:
//   { "success": false, "message": "CNPJ já cadastrado", "data": null, "errorCode": "Conflict" }
//
// VANTAGENS:
//   1. Frontend SEMPRE sabe o formato da resposta
//   2. Tratamento de erro padronizado
//   3. Metadata (success, message, errorCode) sem poluir o data
//   4. Facilita debugging (sempre sabe se foi sucesso ou erro)
// ============================================================

namespace PainelObrigacoes.Shared.ResponseData;

public class ResponseData<T>
{
    public bool Success { get; set; }           // true = sucesso, false = erro
    public string Message { get; set; } = string.Empty; // Mensagem descritiva
    public T? Data { get; set; }                 // Dados de fato (o resultado)
    public ResponseErrorCode? ErrorCode { get; set; } // Código do erro (se houver)

    // Ok: cria uma resposta de sucesso
    public static ResponseData<T> Ok(T data, string message = "")
        => new() { Success = true, Message = message, Data = data };

    // Fail: cria uma resposta de erro
    public static ResponseData<T> Fail(string message, ResponseErrorCode errorCode = ResponseErrorCode.Unknown)
        => new() { Success = false, Message = message, ErrorCode = errorCode };
}

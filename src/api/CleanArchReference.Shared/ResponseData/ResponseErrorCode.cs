// ============================================================
// 🔴 FASE 5.2 — ResponseErrorCode (Códigos de Erro Padronizados)
// ============================================================
//
// Mapeamento exceção → ErrorCode → HTTP Status:
//
//   Exception                 → ErrorCode      → HTTP
//   ─────────────────────────────────────────────────────
//   ValidationException       → Validation     → 400 Bad Request
//   InvalidOperationException → Conflict       → 409 Conflict
//   KeyNotFoundException      → NotFound       → 404 Not Found
//   Exception (outras)        → InternalError  → 500 Server Error
//
// O frontend pode usar errorCode pra mostrar mensagens específicas
// ============================================================

namespace CleanArchReference.Shared.ResponseData;

public enum ResponseErrorCode
{
    Unknown      = 0,
    Validation   = 1,
    NotFound     = 3,
    Conflict     = 4,
    InternalError = 6
}

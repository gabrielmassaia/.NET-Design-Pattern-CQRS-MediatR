// ============================================================
// 🔴 FASE 5.3 — ExceptionMiddleware (O Paraquedas Global)
// ============================================================
//
// Responsabilidade: "Captura QUALQUER exceção que escapar dos handlers"
// O que faz:       Transforma exceções em respostas HTTP padronizadas
//
// MAPA DE EXCEÇÕES → HTTP:
//   ValidationException        → 400 Bad Request    (campos inválidos)
//   InvalidOperationException  → 409 Conflict       (CNPJ duplicado)
//   KeyNotFoundException       → 404 Not Found      (recurso não existe)
//   Exception                  → 500 Server Error   (erro inesperado)
//
// POR QUE ISSO É IMPORTANTE?
//   - NENHUM endpoint precisa de try/catch
//   - TODOS os erros seguem o mesmo formato ResponseData
//   - Em produção: mensagens genéricas (não vaza info interna)
//   - Em desenvolvimento: mensagens detalhadas (facilita debug)
//
// FLUXO:
//   Endpoint → AppService → MediatR → Handler → (exception) → sobe a pilha
//   → ExceptionMiddleware captura → ResponseData.Fail() → HTTP status code
// ============================================================

using System.Net;
using System.Text.Json;
using FluentValidation;
using PainelObrigacoes.Shared.ResponseData;
using Microsoft.AspNetCore.Hosting;

namespace PainelObrigacoes.Api.Middleware;

public sealed class ExceptionMiddleware
{
    private readonly RequestDelegate _next;       // Próximo middleware na pipeline do ASP.NET
    private readonly ILogger<ExceptionMiddleware> _logger; // Logger pra registrar erros
    private readonly IWebHostEnvironment _env;           // Ambiente (Development, Production, etc.)

    // 🔴 CONSTRUTOR: DI injeta as dependências
    // RequestDelegate: o ASP.NET injeta automaticamente (próximo passo da pipeline)
    // ILogger: DI padrão do ASP.NET
    // IWebHostEnvironment: DI padrão do ASP.NET (pra saber se é dev ou prod)
    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IWebHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    // 🔴 InvokeAsync: executado pelo ASP.NET em TODA requisição
    //
    // O try/catch envolve a chamada do próximo middleware
    // Se QUALQUER lugar na cadeia (endpoint, handler, repository) lançar exceção
    // ela é capturada AQUI
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            // Executa o próximo middleware na pipeline
            // Isso vai chamar o endpoint → AppService → MediatR → Handler
            await _next(context);
        }
        // 🟡 ValidationException → 400 Bad Request
        // Lançada pelo ValidationBehavior quando FluentValidation encontra erros
        catch (ValidationException ex)
        {
            var message = _env.IsDevelopment()
                ? string.Join("; ", ex.Errors.Select(e => e.ErrorMessage))
                : "Um ou mais campos são inválidos. Verifique os dados e tente novamente.";

            if (!_env.IsDevelopment())
                _logger.LogWarning("Validation failed: {Errors}",
                    string.Join("; ", ex.Errors.Select(e => e.ErrorMessage)));

            await HandleExceptionAsync(context, ResponseErrorCode.Validation, message, HttpStatusCode.BadRequest);
        }
        // 🟡 InvalidOperationException → 409 Conflict
        // Lançada pelo Handler quando CNPJ já existe
        catch (InvalidOperationException ex)
        {
            var message = _env.IsDevelopment() ? ex.Message : "Operação inválida para o recurso atual.";

            if (!_env.IsDevelopment())
                _logger.LogWarning(ex, "Invalid operation.");

            await HandleExceptionAsync(context, ResponseErrorCode.Conflict, message, HttpStatusCode.Conflict);
        }
        // 🟡 KeyNotFoundException → 404 Not Found
        // Lançada quando um recurso não é encontrado
        catch (KeyNotFoundException ex)
        {
            var message = _env.IsDevelopment() ? ex.Message : "Recurso não encontrado.";

            if (!_env.IsDevelopment())
                _logger.LogWarning(ex, "Resource not found.");

            await HandleExceptionAsync(context, ResponseErrorCode.NotFound, message, HttpStatusCode.NotFound);
        }
        // 🔴 Exception genérica → 500 Server Error
        // Captura QUALQUER outro erro não esperado
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred.");
            await HandleExceptionAsync(context, ResponseErrorCode.InternalError,
                "Ocorreu um erro interno. Tente novamente mais tarde.", HttpStatusCode.InternalServerError);
        }
    }

    // 🔴 HandleExceptionAsync: monta a resposta de erro padronizada
    //
    // Cria um ResponseData<object>.Fail() com:
    //   success: false
    //   message: descrição do erro
    //   errorCode: código do erro (Validation, Conflict, etc.)
    //   data: null
    //
    // Serializa pra JSON e escreve na response HTTP
    private static async Task HandleExceptionAsync(
        HttpContext context, ResponseErrorCode errorCode, string message, HttpStatusCode statusCode)
    {
        context.Response.StatusCode = (int)statusCode;
        context.Response.ContentType = "application/json";

        var response = ResponseData<object>.Fail(message, errorCode);
        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}

using System.Net;
using System.Text.Json;
using FluentValidation;
using PainelObrigacoes.Shared.ResponseData;
using Microsoft.AspNetCore.Hosting;

namespace PainelObrigacoes.Api.Middleware;

public sealed class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IWebHostEnvironment _env;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IWebHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
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
        catch (InvalidOperationException ex)
        {
            var message = _env.IsDevelopment() ? ex.Message : "Operação inválida para o recurso atual.";

            if (!_env.IsDevelopment())
                _logger.LogWarning(ex, "Invalid operation.");

            await HandleExceptionAsync(context, ResponseErrorCode.Conflict, message, HttpStatusCode.Conflict);
        }
        catch (KeyNotFoundException ex)
        {
            var message = _env.IsDevelopment() ? ex.Message : "Recurso não encontrado.";

            if (!_env.IsDevelopment())
                _logger.LogWarning(ex, "Resource not found.");

            await HandleExceptionAsync(context, ResponseErrorCode.NotFound, message, HttpStatusCode.NotFound);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred.");
            await HandleExceptionAsync(context, ResponseErrorCode.InternalError,
                "Ocorreu um erro interno. Tente novamente mais tarde.", HttpStatusCode.InternalServerError);
        }
    }

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

using PainelObrigacoes.Api.Extensions;
using PainelObrigacoes.Application.Obrigacoes.Services;
using PainelObrigacoes.Application.Obrigacoes.ViewModels;
using PainelObrigacoes.Shared.ResponseData;

namespace PainelObrigacoes.Api.Endpoints;

public static class ObrigacoesEndpoints
{
    public static IEndpointRouteBuilder MapObrigacoesEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/obrigacoes")
            .WithTags("Obrigacoes");

        group.MapGet("/", FindObrigacoesAsync)
            .WithName("FindObrigacoes")
            .Produces<ResponseData<IList<ObrigacaoResultViewModel>>>(StatusCodes.Status200OK);

        group.MapPatch("/{id:guid}/entrega", RegistrarEntregaAsync)
            .WithName("RegistrarEntrega")
            .Produces<ResponseData<ObrigacaoResultViewModel>>(StatusCodes.Status200OK)
            .Produces<ResponseData<object>>(StatusCodes.Status404NotFound);

        group.MapGet("/historico/{empresaId:guid}", GetHistoricoEmpresaAsync)
            .WithName("GetHistoricoEmpresa")
            .Produces<ResponseData<IList<ObrigacaoResultViewModel>>>(StatusCodes.Status200OK);

        group.MapGet("/export", ExportObrigacoesAsync)
            .WithName("ExportObrigacoes")
            .RequireRateLimiting("Export");

        return app;
    }

    private static async Task<IResult> FindObrigacoesAsync(
        Guid empresaId,
        int ano,
        int mes,
        int skip = 0,
        int take = 100,
        IObrigacaoAppService appService = default!,
        CancellationToken ct = default)
    {
        var filter = new FindObrigacoesViewModel
        {
            EmpresaId = empresaId,
            Ano = ano,
            Mes = mes,
            Skip = skip,
            Take = take
        };
        var result = await appService.FindAsync(filter, ct);
        return result.ToOkResponse();
    }

    private static async Task<IResult> RegistrarEntregaAsync(
        Guid id,
        RegistrarEntregaViewModel payload,
        IObrigacaoAppService appService,
        CancellationToken ct)
    {
        var result = await appService.RegistrarEntregaAsync(id, payload, ct);
        return result.ToOkResponse();
    }

    private static async Task<IResult> GetHistoricoEmpresaAsync(
        Guid empresaId,
        IObrigacaoAppService appService,
        CancellationToken ct)
    {
        var result = await appService.GetHistoricoAsync(empresaId, ct);
        return result.ToOkResponse();
    }

    private static async Task<IResult> ExportObrigacoesAsync(
        Guid empresaId,
        int ano,
        int mes,
        string formato,
        IObrigacaoAppService appService = default!,
        CancellationToken ct = default)
    {
        var filter = new FindObrigacoesViewModel
        {
            EmpresaId = empresaId,
            Ano = ano,
            Mes = mes
        };
        var (content, contentType, fileName) = await appService.ExportAsync(filter, formato, ct);
        return Results.File(content, contentType, fileName);
    }
}

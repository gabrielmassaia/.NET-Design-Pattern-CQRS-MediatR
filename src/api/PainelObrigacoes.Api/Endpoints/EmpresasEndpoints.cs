using PainelObrigacoes.Api.Extensions;
using PainelObrigacoes.Application.Empresas.Services;
using PainelObrigacoes.Application.Empresas.ViewModels;
using PainelObrigacoes.Shared.ResponseData;

namespace PainelObrigacoes.Api.Endpoints;

public static class EmpresasEndpoints
{
    public static IEndpointRouteBuilder MapEmpresasEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/empresas")
            .WithTags("Empresas");

        group.MapGet("/", FindAllEmpresasAsync)
            .WithName("FindAllEmpresas")
            .Produces<ResponseData<IList<EmpresaResultViewModel>>>(StatusCodes.Status200OK)
            .Produces<ResponseData<object>>(StatusCodes.Status400BadRequest);

        group.MapPost("/", CreateEmpresaAsync)
            .WithName("CreateEmpresa")
            .Produces<ResponseData<EmpresaResultViewModel>>(StatusCodes.Status200OK)
            .Produces<ResponseData<object>>(StatusCodes.Status400BadRequest);

        group.MapGet("/search", SearchEmpresasAsync)
            .WithName("SearchEmpresas")
            .Produces<ResponseData<IList<EmpresaResultViewModel>>>(StatusCodes.Status200OK);

        group.MapDelete("/{id:guid}", DeleteEmpresaAsync)
            .WithName("DeleteEmpresa")
            .Produces<ResponseData<bool>>(StatusCodes.Status200OK)
            .Produces<ResponseData<object>>(StatusCodes.Status404NotFound);

        return app;
    }

    private static async Task<IResult> FindAllEmpresasAsync(
        int skip = 0,
        int take = 50,
        IEmpresaAppService appService = default!,
        CancellationToken ct = default)
    {
        var result = await appService.FindAllAsync(skip, take, ct);
        return result.ToOkResponse();
    }

    private static async Task<IResult> CreateEmpresaAsync(
        CreateEmpresaViewModel payload,
        IEmpresaAppService appService,
        CancellationToken ct)
    {
        var result = await appService.CreateAsync(payload, ct);
        return result.ToOkResponse();
    }

    private static async Task<IResult> SearchEmpresasAsync(
        string q = "",
        IEmpresaAppService appService = default!,
        CancellationToken ct = default)
    {
        var result = await appService.SearchAsync(q, ct);
        return result.ToOkResponse();
    }

    private static async Task<IResult> DeleteEmpresaAsync(
        Guid id,
        IEmpresaAppService appService,
        CancellationToken ct)
    {
        var result = await appService.DeleteAsync(id, ct);
        return result.ToOkResponse();
    }
}

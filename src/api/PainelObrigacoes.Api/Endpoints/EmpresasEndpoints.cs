// ============================================================
// 🔵 FASE 1 — Api Layer (Endpoint)
// ============================================================
//
// Responsabilidade: "Portão de entrada da API"
// O que faz:        Recebe HTTP, chama AppService, envelopa resposta
//
// REGRAS DE OURO:
//   ❌ NUNCA ter regra de negócio aqui
//   ❌ NUNCA ter try/catch (ExceptionMiddleware cuida disso)
//   ❌ NUNCA chamar Repository direto
//   ✅ Só chamar AppService e retornar resultado
//
// ============================================================
// FLUXO COMPLETO:
//   HTTP Request → ASP.NET cria ViewModel → DI injeta AppService
//   → appService.CreateAsync() → resultado → ToOkResponse() → 200 OK
// ============================================================

using PainelObrigacoes.Api.Extensions;
using PainelObrigacoes.Application.Empresas.Services;
using PainelObrigacoes.Application.Empresas.ViewModels;
using PainelObrigacoes.Shared.ResponseData;

namespace PainelObrigacoes.Api.Endpoints;

public static class EmpresasEndpoints
{
    // MapEmpresasEndpoints: registra as rotas no pipeline do ASP.NET
    // Isso é chamado no Program.cs: app.MapEmpresasEndpoints()
    public static IEndpointRouteBuilder MapEmpresasEndpoints(this IEndpointRouteBuilder app)
    {
        // Cria um grupo de rotas com prefixo /api/empresas
        // Todas as rotas desse grupo começam com /api/empresas
        var group = app.MapGroup("/api/empresas")
            .WithTags("Empresas");

        group.MapGet("/", FindAllEmpresasAsync)
            .WithName("FindAllEmpresas")
            .Produces<ResponseData<IList<EmpresaResultViewModel>>>(StatusCodes.Status200OK)
            .Produces<ResponseData<object>>(StatusCodes.Status400BadRequest);

        // 🟢 Rota que nos interessa: POST /api/empresas
        // O ASP.NET automaticamente:
        //   1. Lê o JSON do body da request
        //   2. Cria um objeto CreateEmpresaViewModel com os dados
        //   3. Injeta IEmpresaAppService (via DI — ver ProjectBootstrapper)
        //   4. Injeta CancellationToken (se o cliente desconectar, cancela)
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

    // GET /api/empresas?skip=0&take=50
    private static async Task<IResult> FindAllEmpresasAsync(
        int skip = 0,
        int take = 50,
        IEmpresaAppService appService = default!, // DI: injeta automaticamente
        CancellationToken ct = default)
    {
        var result = await appService.FindAllAsync(skip, take, ct);
        return result.ToOkResponse(); // envelopa em ResponseData antes de retornar
    }

    // 🟢 POST /api/empresas — FLUXO PRINCIPAL QUE ESTAMOS ESTUDANDO
    //
    // payload: CreateEmpresaViewModel ← ASP.NET cria do JSON automaticamente
    // appService: IEmpresaAppService ← DI injeta (ver EmpresaSetup.cs)
    private static async Task<IResult> CreateEmpresaAsync(
        CreateEmpresaViewModel payload,
        IEmpresaAppService appService,
        CancellationToken ct)
    {
        // 🔵 CHAMA O APPSERVICE (FASE 2) e espera o resultado
        // O AppService vai orquestrar toda a cadeia:
        //   AutoMapper → MediatR → Validation → Handler → Repository → UoW
        var result = await appService.CreateAsync(payload, ct);

        // 🔴 Envelopa em ResponseData e retorna 200 OK
        //   Se der erro, o ExceptionMiddleware (FASE 5.3) captura antes de chegar aqui
        return result.ToOkResponse();
    }

    // GET /api/empresas/search?q=
    private static async Task<IResult> SearchEmpresasAsync(
        string q = "",
        IEmpresaAppService appService = default!,
        CancellationToken ct = default)
    {
        var result = await appService.SearchAsync(q, ct);
        return result.ToOkResponse();
    }

    // DELETE /api/empresas/{id}
    private static async Task<IResult> DeleteEmpresaAsync(
        Guid id,
        IEmpresaAppService appService,
        CancellationToken ct)
    {
        var result = await appService.DeleteAsync(id, ct);
        return result.ToOkResponse();
    }
}

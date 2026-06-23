// ============================================================
// 🟢 FASE 2 — Application Layer (AppService)
// ============================================================
//
// Responsabilidade: "Tradutor entre as camadas"
// O que faz:        ViewModel → Command → (MediatR) → Model → ResultViewModel
//
// REGRAS DE OURO:
//   ✅ Só orquestra, NÃO tem regra de negócio
//   ❌ NUNCA chama Repository direto
//   ❌ NUNCA tem if/else de negócio
//   ✅ Só traduz dados entre camadas
//
// ============================================================
// FLUXO DENTRO DESSE ARQUIVO:
//   CreateEmpresaViewModel → AutoMapper → CreateEmpresaCommand
//   → MediatrService.SendCommand() → [Domain inteiro processa]
//   → EmpresaModel volta → AutoMapper → EmpresaResultViewModel
// ============================================================

using AutoMapper;
using PainelObrigacoes.Application.Empresas.ViewModels;
using PainelObrigacoes.Domain.Empresas.Commands;
using PainelObrigacoes.Domain.Empresas.Queries;
using PainelObrigacoes.Domain.Shared.Interfaces;

namespace PainelObrigacoes.Application.Empresas.Services;

public sealed class EmpresaAppService : IEmpresaAppService
{
    // Dependências injetadas pelo DI via construtor
    private readonly IMediatrService _mediator; // Ponte para o MediatR (definida no Domain, implementada no IoC)
    private readonly IMapper _mapper;           // AutoMapper: copia campos entre objetos de camadas diferentes

    // 🟢 CONSTRUTOR: DI (Injeção de Dependência)
    //
    // O ASP.NET vai criar esse objeto automaticamente quando alguém pedir IEmpresaAppService
    // As dependências são resolvidas pelo container de DI (ver ProjectBootstrapper.cs)
    //
    // IMediatrService → instância de MediatrService (IoC/MediatrService.cs)
    // IMapper          → instância do AutoMapper (configurado em ProjectBootstrapper)
    public EmpresaAppService(IMediatrService mediator, IMapper mapper)
    {
        _mediator = mediator;
        _mapper = mapper;
    }

    // GET /api/empresas
    public async Task<IList<EmpresaResultViewModel>> FindAllAsync(int skip = 0, int take = 50, CancellationToken ct = default)
    {
        // 1. Cria um Query (consulta, não altera estado)
        var models = await _mediator.SendQuery(new FindEmpresasQuery { Skip = skip, Take = take }, ct);
        // 2. Traduz Model (Domain) → ViewModel (Application) pro HTTP
        return _mapper.Map<IList<EmpresaResultViewModel>>(models);
    }

    // 🟢 POST /api/empresas — FLUXO PRINCIPAL QUE ESTAMOS ESTUDANDO
    //
    // PASSO A PASSO:
    //   PASSO 1: Traduz ViewModel (Application) → Command (Domain)
    //     - CreateEmpresaViewModel veio do HTTP (JSON)
    //     - CreateEmpresaCommand é o que o Domain entende
    //     - AutoMapper copia CNPJ→CNPJ, RazaoSocial→RazaoSocial, Regime→Regime
    //     - Por que não usar o mesmo objeto? Camadas diferentes = responsabilidades diferentes
    //
    //   PASSO 2: Envia o Command pelo MediatR
    //     - IMediatrService.SendCommand() → MediatrService.SendCommand() → IMediator.Send()
    //     - O MediatR vai passar pelo pipeline: ValidationBehavior → Handler
    //     - O Handler (Domain) processa a regra de negócio e retorna EmpresaModel
    //
    //   PASSO 3: Traduz Model (Domain) → ViewModel (Application)
    //     - EmpresaModel tem Id, CreatedAt (que vieram do banco)
    //     - EmpresaResultViewModel é o que o HTTP vai devolver
    //     - AutoMapper copia Id→Id, CNPJ→CNPJ, etc.
    public async Task<EmpresaResultViewModel> CreateAsync(
        CreateEmpresaViewModel viewModel, CancellationToken ct = default)
    {
        // PASSO 1: ViewModel (Application) → Command (Domain)
        var command = _mapper.Map<CreateEmpresaCommand>(viewModel);

        // PASSO 2: Envia pela cadeia do MediatR (FASE 3 inteira)
        var model = await _mediator.SendCommand(command, ct);

        // PASSO 3: Model (Domain) → ResultViewModel (Application)
        return _mapper.Map<EmpresaResultViewModel>(model);
    }

    // DELETE /api/empresas/{id}
    public Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
        => _mediator.SendCommand(new DeleteEmpresaCommand { Id = id }, ct);

    // GET /api/empresas/search?q=
    public async Task<IList<EmpresaResultViewModel>> SearchAsync(string query, CancellationToken ct = default)
    {
        var q = new SearchEmpresasQuery { Query = query };
        var models = await _mediator.SendQuery(q, ct);
        return _mapper.Map<IList<EmpresaResultViewModel>>(models);
    }
}

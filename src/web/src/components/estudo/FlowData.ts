export interface PhaseStep {
  id: string;
  phase: number;
  emoji: string;
  label: string;
  title: string;
  layer: string;
  files: string[];
  summary: string;
  concept: string;
  rule: string;
  code: string;
  explanation: string;
  highlightLines?: number[];
}

export interface DiRegistration {
  interface: string;
  implementation: string;
  layer: string;
  lifetime: string;
  file: string;
  purpose: string;
}

export interface MediatrStep {
  step: string;
  icon: string;
  code: string;
  explanation: string;
  highlightLines?: number[];
}

export const PHASES: PhaseStep[] = [
  {
    id: 'endpoint',
    phase: 1,
    emoji: '🔵',
    label: 'FASE 1',
    title: 'Api Layer — Endpoint',
    layer: 'Api',
    files: ['Api/Endpoints/EmpresasEndpoints.cs', 'Api/Extensions/ResultExtensions.cs', 'Api/Program.cs'],
    summary: 'Portão de entrada da API. Recebe HTTP, chama AppService, envelopa resposta.',
    concept: 'Minimal API · Zero lógica de negócio · Sem try/catch',
    rule: '❌ NUNCA ter regra de negócio · ❌ NUNCA chamar Repository · ✅ Só chamar AppService',
    code: `// ============================================================
// 🔵 FASE 1 — Endpoint
// POST /api/empresas
// ============================================================
// O ASP.NET faz 3 coisas automaticamente:
//   1. Lê o JSON do body → cria CreateEmpresaViewModel
//   2. Injeta IEmpresaAppService pelo DI
//   3. Injeta CancellationToken (se desconectar, cancela)

private static async Task<IResult> CreateEmpresaAsync(
    CreateEmpresaViewModel payload,  // ← JSON vira objeto C#
    IEmpresaAppService appService,   // ← DI: "me dá quem sabe criar empresa"
    CancellationToken ct)            // ← pra cancelar se cliente fechar
{
    // Chama o AppService (FASE 2) — ele orquestra o resto
    var result = await appService.CreateAsync(payload, ct);

    // Envelopa: { success: true, data: { id, cnpj, ... } }
    return result.ToOkResponse();
    //
    // ❌ NENHUM try/catch aqui!
    // Se algo der erro, o ExceptionMiddleware captura
}`,
    explanation: `O endpoint é a porta de entrada. Ele é propositalmente magro — não tem regra de negócio, não tem try/catch, não chama banco.

O ASP.NET automaticamente:
• Deserializa o JSON do body em um objeto C# (CreateEmpresaViewModel)
• Injeta as dependências via DI (IEmpresaAppService)
• Gerencia o ciclo de vida da request (CancellationToken)

O método ToOkResponse() envelopa o resultado no padrão ResponseData:
{ "success": true, "data": { ... } }

Se algo der erro em qualquer camada, o ExceptionMiddleware (FASE 5) captura e devolve um JSON padronizado.`,
    highlightLines: [7, 8, 9, 11, 13]
  },
  {
    id: 'appservice',
    phase: 2,
    emoji: '🟢',
    label: 'FASE 2',
    title: 'Application Layer — AppService',
    layer: 'Application',
    files: ['Application/Empresas/Services/EmpresaAppService.cs', 'Application/Empresas/AutoMapper/EmpresaProfile.cs'],
    summary: 'Tradutor entre as camadas. ViewModel → Command → (MediatR) → Model → ResultViewModel.',
    concept: 'Facade Pattern · Tradutor de dados · Zero regra de negócio',
    rule: '✅ Só orquestra · ❌ NUNCA chama Repository · ❌ NUNCA tem if de negócio',
    code: `// ============================================================
// 🟢 FASE 2 — AppService (O Tradutor)
// ============================================================
// Dependências injetadas pelo DI via construtor:
//   IMediatrService → ponte para o MediatR
//   IMapper         → AutoMapper (copia campos entre objetos)

public sealed class EmpresaAppService : IEmpresaAppService
{
    private readonly IMediatrService _mediator;
    private readonly IMapper _mapper;

    public EmpresaAppService(IMediatrService mediator, IMapper mapper)
    {
        _mediator = mediator;  // ← DI injeta MediatrService
        _mapper = mapper;      // ← DI injeta AutoMapper
    }

    public async Task<EmpresaResultViewModel> CreateAsync(
        CreateEmpresaViewModel viewModel, CancellationToken ct)
    {
        // PASSO 1: Traduz ViewModel (Application) → Command (Domain)
        //   CreateEmpresaViewModel → CreateEmpresaCommand
        //   AutoMapper copia: CNPJ, RazaoSocial, Regime
        var command = _mapper.Map<CreateEmpresaCommand>(viewModel);

        // PASSO 2: Envia pelo MediatR (FASE 3 inteira)
        //   ValidationBehavior → Handler → Repository → UoW
        var model = await _mediator.SendCommand(command, ct);

        // PASSO 3: Traduz Model (Domain) → ResultViewModel (Application)
        //   EmpresaModel → EmpresaResultViewModel
        //   Agora tem Id e CreatedAt que vieram do banco
        return _mapper.Map<EmpresaResultViewModel>(model);
    }
}`,
    explanation: `O AppService é o "tradutor". Ele não tem regra de negócio — só orquestra a tradução entre camadas:

1. ViewModel → Command: o que chegou do HTTP vira o que o Domain entende
2. Envia pelo MediatR: o coração do CQRS processa o comando
3. Model → ResultViewModel: o resultado do Domain vira o que o HTTP devolve

Por que não pular o AppService e chamar o MediatR direto do endpoint?
• O endpoint não deveria saber que MediatR existe
• O AppService isola o endpoint de mudanças internas
• Facilita testes: testa o AppService sem HTTP`,
    highlightLines: [12, 13, 20, 21, 24, 27]
  },
  {
    id: 'domain',
    phase: 3,
    emoji: '🟡',
    label: 'FASE 3',
    title: 'Domain — MediatR Pipeline',
    layer: 'Domain',
    files: ['Domain/Empresas/Commands/CreateEmpresaCommand.cs', 'Domain/Empresas/CommandHandlers/CreateEmpresaCommandHandler.cs', 'Domain/Shared/Behaviors/ValidationBehavior.cs'],
    summary: 'Coração do sistema. Toda regra de negócio e pipeline do MediatR.',
    concept: 'CQRS · MediatR · FluentValidation · Pipeline Behavior · Domain Events',
    rule: '❌ NÃO depende de Application/Infra · ✅ Regra de negócio pura · ✅ Zero dependências externas',
    code: `// ============================================================
// 🟡 FASE 3.2 — ValidationBehavior (Pipeline do MediatR)
// ============================================================
// Roda ANTES do handler. Se falhar, handler nem executa.

public sealed class ValidationBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken ct)
    {
        // Se não tem validator pra esse comando, passa direto
        if (!_validators.Any())
            return await next();

        // Roda TODOS os validators em paralelo
        var failures = /* validação com FluentValidation */;

        // Se erro → throw → ExceptionMiddleware → 400 BadRequest
        if (failures.Count != 0)
            throw new ValidationException(failures);

        // Tudo OK → chama o Handler
        return await next();
    }
}

// 🟡 FASE 3.4 — CommandHandler (Regra de Negócio)
// ============================================================
// 7 passos: validar negócio → criar model → persistir →
// gerar obrigações → persistir → commit → eventos

public async Task<EmpresaModel> Handle(
    CreateEmpresaCommand command, CancellationToken ct)
{
    // 1. VALIDAÇÃO DE NEGÓCIO (CNPJ duplicado)
    if (await _empresaRepository.ExistsByCnpjAsync(cnpjLimpo))
        throw new InvalidOperationException("CNPJ já cadastrado.");

    // 2. Cria o Model de domínio
    var model = command.ToModel();

    // 3. Persiste empresa (ChangeTracker, sem banco)
    _empresaRepository.Create(model);

    // 4. Gera obrigações fiscais (Rules Engine)
    for (int mes = _clock.CurrentMonth; mes <= 12; mes++)
        obrigacoes.AddRange(_rulesEngine.GenerateObrigacoes(...));

    // 5. Persiste obrigações
    _obrigacaoRepository.CreateRange(obrigacoes);

    // 6. COMMIT ÚNICO (transação atômica)
    await _unitOfWork.CompleteAsync(ct);

    // 7. Publica Domain Event (side effects)
    await _mediator.Publish(new EmpresaCreatedEvent(...), ct);

    return model;
}`,
    explanation: `O Domain é o coração do sistema. Aqui moram as regras de negócio PURAS, sem dependência de banco, HTTP ou frameworks.

O MediatR cria um pipeline que roda antes do handler:
1. Command chega pelo MediatR
2. ValidationBehavior executa FluentValidation (formato do CNPJ, obrigatoriedade)
3. Se válido → Handler roda a regra de negócio
4. Handler publica Domain Events para side effects (indexar Meilisearch, limpar cache)

O ValidationBehavior valida CAMPOS (formato). O Handler valida NEGÓCIO (duplicidade).
Isso separa responsabilidades e mantém o código limpo.`,
    highlightLines: [28, 33, 35, 41, 47, 50, 53, 56]
  },
  {
    id: 'infrastructure',
    phase: 4,
    emoji: '🟠',
    label: 'FASE 4',
    title: 'Infrastructure.Data — Implementação',
    layer: 'Infrastructure.Data',
    files: ['Infrastructure.Data/Repositories/EmpresaRepository.cs', 'Infrastructure.Data/Context/UnitOfWork.cs', 'Infrastructure.Data/Events/EmpresaCreatedHandler.cs'],
    summary: 'Onde o EF Core e o banco de dados realmente entram em ação.',
    concept: 'Repository · Unit of Work · EF Core · Domain Events',
    rule: '✅ Repository NUNCA chama SaveChanges · ❌ Repository não tem regra de negócio',
    code: `// ============================================================
// 🟠 FASE 4.1 — Repository (EF Core)
// ============================================================
// Responsabilidade: traduzir Model (Domain) ↔ Entity (EF Core)
// ❌ NUNCA chama SaveChanges — isso é do UnitOfWork

public sealed class EmpresaRepository : IEmpresaRepository
{
    public void Create(EmpresaModel model)
    {
        var entity = ToEntity(model);     // Model → Entity
        _context.Empresas.Add(entity);    // Só rastreia (ChangeTracker)
        model.Id = entity.Id;             // Copia ID gerado
        // ❌ NÃO chama SaveChanges aqui!
    }
}

// 🟠 FASE 4.2 — UnitOfWork (O Confirmador)
// ============================================================
// ÚNICO lugar que chama SaveChanges em todo o sistema

public sealed class UnitOfWork : IUnitOfWork
{
    public Task CompleteAsync(CancellationToken ct)
        => _context.SaveChangesAsync(ct);  // UM SaveChanges pra TUDO
}

// 🟠 FASE 4.3 — Event Handler (Side Effects)
// ============================================================
// Executado DEPOIS da empresa ser criada

public async Task Handle(EmpresaCreatedEvent notification, CancellationToken ct)
{
    // 1. Indexa no Meilisearch (busca full-text)
    await _searchService.IndexAsync(model, ct);
    // 2. Invalida cache do Redis
    await _cache.RemoveAsync($"dashboard:{now.Year}:{now.Month}", ct);
    await _cache.RemoveAsync("alertas:current", ct);
}`,
    explanation: `A Infrastructure.Data é onde o "borracha encontra a estrada" — aqui o EF Core traduz as operações em SQL.

Repository: só rastreia mudanças no ChangeTracker do EF. NUNCA chama SaveChanges.
UnitOfWork: ÚNICO lugar que chama SaveChanges. Garante atomicidade (tudo ou nada).

Por que separar? Se o repository salvasse e a geração de obrigações falhasse depois, a empresa ficaria sem obrigações no banco. Com o UnitOfWork, se algo falha, NADA é salvo.

O Event Handler roda em paralelo após o commit. Se o Meilisearch falhar, a empresa ainda foi criada — isso é eventual consistency.`,
    highlightLines: [6, 7, 8, 9, 17, 18, 24, 25, 26]
  },
  {
    id: 'response',
    phase: 5,
    emoji: '🔴',
    label: 'FASE 5',
    title: 'Resposta — ExceptionMiddleware + ResponseData',
    layer: 'Api + Shared',
    files: ['Api/Middleware/ExceptionMiddleware.cs', 'Shared/ResponseData/ResponseData.cs'],
    summary: 'Toda resposta segue o padrão ResponseData. Erros são capturados globalmente.',
    concept: 'Exception Middleware · ResponseData Envelope · Error Codes',
    rule: '✅ NENHUM endpoint tem try/catch · ✅ Erro padronizado · ✅ Seguro em produção',
    code: `// ============================================================
// 🔴 FASE 5.1 — ExceptionMiddleware (Paraquedas Global)
// ============================================================
// Captura QUALQUER exceção que escapar

public async Task InvokeAsync(HttpContext context)
{
    try
    {
        await _next(context);  // Executa endpoint + toda cadeia
    }
    catch (ValidationException ex)
    {
        // 400 Bad Request — campos inválidos
        return ResponseData.Fail(message, Validation);
    }
    catch (InvalidOperationException ex)
    {
        // 409 Conflict — CNPJ duplicado
        return ResponseData.Fail(message, Conflict);
    }
    catch (KeyNotFoundException ex)
    {
        // 404 Not Found — recurso não existe
        return ResponseData.Fail(message, NotFound);
    }
    catch (Exception ex)
    {
        // 500 Server Error — genérico (seguro)
        return ResponseData.Fail("Erro interno", InternalError);
    }
}

// 🔴 FASE 5.2 — ResponseData (Envelope Padrão)
// ============================================================
// Toda resposta da API segue esse formato:
// { "success": true, "data": { ... }, "errorCode": null }`,
    explanation: `O ExceptionMiddleware é o "paraquedas" de toda a aplicação. NENHUM endpoint precisa de try/catch porque esse middleware captura tudo.

O mapeamento de exceções para HTTP:
• ValidationException (FluentValidation) → 400 BadRequest
• InvalidOperationException (CNPJ duplicado) → 409 Conflict
• KeyNotFoundException (recurso não existe) → 404 NotFound
• Exception genérica → 500 InternalError

Em produção, as mensagens de erro são genéricas (não vazam detalhes internos).
Em desenvolvimento, mostram detalhes completos para debug.

O ResponseData envelope padroniza TODAS as respostas, facilitando o tratamento no frontend.`,
    highlightLines: [6, 7, 11, 15, 20, 25]
  }
];

export const DI_REGISTRATIONS: DiRegistration[] = [
  {
    interface: 'IEmpresaAppService',
    implementation: 'EmpresaAppService',
    layer: 'Application',
    lifetime: 'Scoped',
    file: 'IoC/Empresas/EmpresaSetup.cs',
    purpose: 'Tradutor entre HTTP e Domain'
  },
  {
    interface: 'IEmpresaRepository',
    implementation: 'EmpresaRepository',
    layer: 'Infrastructure.Data',
    lifetime: 'Scoped',
    file: 'IoC/Empresas/EmpresaSetup.cs',
    purpose: 'Acesso a dados de empresa (EF Core)'
  },
  {
    interface: 'IUnitOfWork',
    implementation: 'UnitOfWork',
    layer: 'Infrastructure.Data',
    lifetime: 'Scoped',
    file: 'IoC/ProjectBootstrapper.cs',
    purpose: 'Commit único (SaveChanges)'
  },
  {
    interface: 'IMediatrService',
    implementation: 'MediatrService',
    layer: 'Infrastructure.IoC',
    lifetime: 'Scoped',
    file: 'IoC/ProjectBootstrapper.cs',
    purpose: 'Ponte AppService → MediatR (DIP)'
  },
  {
    interface: 'IObrigacaoRepository',
    implementation: 'ObrigacaoRepository',
    layer: 'Infrastructure.Data',
    lifetime: 'Scoped',
    file: 'IoC/Obrigacoes/ObrigacaoSetup.cs',
    purpose: 'Acesso a dados de obrigação'
  },
  {
    interface: 'ITributaryRulesEngine',
    implementation: 'TributaryRulesEngine',
    layer: 'Domain',
    lifetime: 'Scoped',
    file: 'IoC/Obrigacoes/ObrigacaoSetup.cs',
    purpose: 'Geração de obrigações por regime'
  },
  {
    interface: 'IDateTimeProvider',
    implementation: 'DateTimeProvider',
    layer: 'Infrastructure.Data',
    lifetime: 'Singleton',
    file: 'IoC/ProjectBootstrapper.cs',
    purpose: 'Relógio do sistema (testável)'
  },
  {
    interface: 'IEmpresaSearchService',
    implementation: 'MeilisearchEmpresaService',
    layer: 'Infrastructure.Data',
    lifetime: 'Scoped',
    file: 'IoC/Empresas/EmpresaSetup.cs',
    purpose: 'Indexação/busca no Meilisearch'
  },
];

export const MEDIATR_STEPS: MediatrStep[] = [
  {
    step: 'AppService envia Command',
    icon: '📤',
    code: `// AppService chama o MediatrService
// que chama o IMediator do MediatR
var model = await _mediator.SendCommand(command, ct);
//           └── MediatrService.SendCommand()
//               └── IMediator.Send(command)
//                   └── MediatR acha o handler certo`,
    explanation: `O AppService envia o Command via IMediatrService. A implementação MediatrService (no IoC) delega pro IMediator do MediatR.

O MediatR então:
1. Verifica se tem pipeline behaviors registrados → acha o ValidationBehavior
2. Acha o IRequestHandler<CreateEmpresaCommand, EmpresaModel> → o handler
3. Executa o pipeline: ValidationBehavior → Handler`
  },
  {
    step: 'ValidationBehavior',
    icon: '✅',
    code: `// IPipelineBehavior roda ANTES do handler
public sealed class ValidationBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken ct)
    {
        // Busca TODOS os IValidator<TRequest> registrados
        var failures = _validators
            .Select(v => v.ValidateAsync(request, ct))
            .SelectMany(r => r.Errors)
            .ToList();

        // Se falhou → throw → 400 BadRequest
        if (failures.Count != 0)
            throw new ValidationException(failures);

        // Tudo ok → chama o próximo passo (Handler)
        return await next();
    }
}`,
    explanation: `O ValidationBehavior é um IPipelineBehavior do MediatR — um "interceptador" que roda antes do handler.

Ele pega TODOS os validators do FluentValidation registrados para aquele tipo de comando e executa todos em paralelo.

Se encontrar erros, lança ValidationException, que o ExceptionMiddleware captura e retorna 400 BadRequest.

Isso é cross-cutting validation — o handler nunca precisa se preocupar com formato de campos.`
  },
  {
    step: 'CommandHandler processa',
    icon: '⚡',
    code: `// IRequestHandler<TCommand, TResponse>
public sealed class CreateEmpresaCommandHandler
    : IRequestHandler<CreateEmpresaCommand, EmpresaModel>
{
    // DI injeta TODAS as dependências
    public async Task<EmpresaModel> Handle(
        CreateEmpresaCommand command, CancellationToken ct)
    {
        // 1. Regra de negócio (CNPJ duplicado?)
        if (await _empresaRepository.ExistsByCnpjAsync(cnpj))
            throw new InvalidOperationException("CNPJ já existe");

        // 2. Cria e persiste
        var model = command.ToModel();
        _empresaRepository.Create(model);

        // 3. Gera obrigações e persiste
        _obrigacaoRepository.CreateRange(obrigacoes);

        // 4. Commit único
        await _unitOfWork.CompleteAsync(ct);

        // 5. Eventos de domínio
        await _mediator.Publish(new EmpresaCreatedEvent(...), ct);

        return model;
    }
}`,
    explanation: `O Handler é o coração. O MediatR encontra ele automaticamente porque ele implementa IRequestHandler<CreateEmpresaCommand, EmpresaModel>.

O MediatR faz o "roteamento" baseado no TIPO do Command:
• CreateEmpresaCommand → CreateEmpresaCommandHandler
• DeleteEmpresaCommand → DeleteEmpresaCommandHandler

O handler executa a regra de negócio em 5 passos. Note que ele depende de INTERFACES (IEmpresaRepository, IUnitOfWork), não de implementações concretas — isso é DIP.`
  },
  {
    step: 'Domain Events (side effects)',
    icon: '📢',
    code: `// Evento é publicado pelo handler
await _mediator.Publish(
    new EmpresaCreatedEvent(id, cnpj, razao, regime), ct);

// O MediatR encontra TODOS os handlers deste evento
// (INotificationHandler<EmpresaCreatedEvent>)
public sealed class EmpresaCreatedHandler
    : INotificationHandler<EmpresaCreatedEvent>
{
    public async Task Handle(
        EmpresaCreatedEvent notification, CancellationToken ct)
    {
        // 1. Indexa no Meilisearch
        await _searchService.IndexAsync(model, ct);
        // 2. Invalida cache Redis
        await _cache.RemoveAsync("dashboard:...", ct);
    }
}`,
    explanation: `Domain Events são diferentes de Commands:

• Command (IRequest): "FAÇA ISSO AGORA" — tem retorno, é síncrono
• Event (INotification): "ISSO ACONTECEU" — não tem retorno, é fogo-e-esqueça

VANTAGENS:
• Desacopla side effects (indexação, cache) da operação principal
• Se o Meilisearch falhar, a empresa ainda foi criada
• Vários handlers podem escutar o mesmo evento
• Fácil adicionar novos side effects sem mudar o handler`
  }
];

export const PROJECT_DEPENDENCIES = [
  { from: 'Api', to: 'Application', label: 'chama' },
  { from: 'Api', to: 'IoC', label: 'registra DI' },
  { from: 'Api', to: 'Shared', label: 'usa ResponseData' },
  { from: 'Application', to: 'Domain', label: 'usa interfaces' },
  { from: 'Application', to: 'Shared', label: 'usa' },
  { from: 'IoC', to: 'Application', label: 'registra' },
  { from: 'IoC', to: 'Domain', label: 'registra' },
  { from: 'IoC', to: 'Infrastructure.Data', label: 'registra' },
  { from: 'Infrastructure.Data', to: 'Domain', label: 'implementa' },
  { from: 'Domain', to: 'Shared', label: 'usa' },
];

// ─── Quiz de Entrevista ───────────────────────────────────────────────────────

export interface QuizQuestion {
  id: number;
  category: 'Arquitetura' | 'CQRS' | 'C#' | 'Infraestrutura';
  question: string;
  answer: string;
}

export const INTERVIEW_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'Arquitetura',
    question: 'O que é Clean Architecture e qual a regra fundamental de dependência?',
    answer: 'Clean Architecture organiza o código em camadas concêntricas onde as dependências só apontam para dentro (para o Domain). O Domain não conhece nada externo — nem EF Core, nem MediatR, nem ASP.NET. Isso garante que a lógica de negócio é testável sem nenhuma infraestrutura.',
  },
  {
    id: 2,
    category: 'Arquitetura',
    question: 'Por que o AppService não chama o Repository direto?',
    answer: 'O AppService só orquestra — ele não tem regra de negócio. Quem tem regra de negócio é o Handler no Domain. Se o AppService chamasse o Repository diretamente, estaria pulando a camada de domínio e misturando responsabilidades. A sequência correta é: AppService → MediatR → Handler → Repository.',
  },
  {
    id: 3,
    category: 'Arquitetura',
    question: 'O que é o Dependency Inversion Principle e como ele aparece aqui?',
    answer: 'DIP diz que módulos de alto nível não devem depender de módulos de baixo nível — ambos devem depender de abstrações. No projeto: IEmpresaRepository é definida no Domain, mas implementada no Infrastructure.Data. O Handler depende da interface (abstração), não do EF Core (concreção). Isso permite trocar o banco sem mudar o domínio.',
  },
  {
    id: 4,
    category: 'CQRS',
    question: 'O que é CQRS e quando faz sentido usar?',
    answer: 'CQRS (Command Query Responsibility Segregation) separa operações de escrita (Commands) das de leitura (Queries). Commands retornam o resultado da operação e têm side effects. Queries só leem, sem mutar estado. Faz sentido quando leitura e escrita têm necessidades muito diferentes, como quando você quer cache agressivo nas queries mas consistência forte nos commands.',
  },
  {
    id: 5,
    category: 'CQRS',
    question: 'Por que ValidationBehavior existe separado do Handler?',
    answer: 'Para separar dois tipos de validação com responsabilidades diferentes. O Validator valida CAMPOS (formato do CNPJ, obrigatoriedade) — isso é cross-cutting e roda antes de qualquer handler. O Handler valida NEGÓCIO (CNPJ duplicado) — isso requer acesso ao banco e é específico do fluxo. Misturar os dois violaria o SRP.',
  },
  {
    id: 6,
    category: 'CQRS',
    question: 'Qual a diferença entre IRequest e INotification no MediatR?',
    answer: 'IRequest é para Commands e Queries — tem retorno, exatamente um handler, e é síncrono no pipeline. INotification é para Domain Events — não tem retorno (fire-and-forget), pode ter zero ou N handlers, e é ideal para side effects (indexar Meilisearch, invalidar cache). Um Command ORDENA algo; um Event NOTIFICA que algo aconteceu.',
  },
  {
    id: 7,
    category: 'CQRS',
    question: 'Por que o Command e o ViewModel são objetos diferentes se têm os mesmos campos?',
    answer: 'Eles vivem em camadas diferentes com propósitos diferentes. A ViewModel (Application) pode ter CNPJ formatado "11.222.333/0001-81", campos de UI e validação de formato HTTP. O Command (Domain) só tem campos de negócio e comportamento de domínio (ToModel() que limpa o CNPJ). Misturar viola a Clean Architecture — o Domain não pode conhecer conceitos de HTTP.',
  },
  {
    id: 8,
    category: 'Infraestrutura',
    question: 'Por que o Repository nunca chama SaveChanges?',
    answer: 'Para garantir atomicidade via Unit of Work. Se o Repository de Empresa chamasse SaveChanges e depois a geração de obrigações falhasse, a empresa ficaria no banco sem obrigações — dados inconsistentes. Com o UnitOfWork, TODAS as operações (Create empresa + CreateRange obrigações) são rastreadas no ChangeTracker e commit acontece em um único SaveChangesAsync.',
  },
  {
    id: 9,
    category: 'Infraestrutura',
    question: 'O que acontece se o Meilisearch estiver offline na hora de criar empresa?',
    answer: 'A empresa é criada normalmente. O Domain Event (EmpresaCreatedEvent) é publicado APÓS o commit do banco. O handler que indexa no Meilisearch é um side effect eventual — se ele falhar, não afeta a transação principal. Isso é eventual consistency: a empresa existe no banco antes de estar indexada para busca. O Meilisearch é reconstruído quando ficar disponível.',
  },
  {
    id: 10,
    category: 'Infraestrutura',
    question: 'O que é o ExceptionMiddleware e por que nenhum endpoint tem try/catch?',
    answer: 'O ExceptionMiddleware é um middleware global que envolve toda a cadeia de request/response. Qualquer exceção não tratada sobe o call stack e é capturada aqui, mapeada para um HTTP status code e serializada como ResponseData padronizado. Isso centraliza o tratamento de erros — se cada endpoint tivesse try/catch, o código seria duplicado e inconsistente.',
  },
  {
    id: 11,
    category: 'C#',
    question: 'Por que usar sealed class em vez de class para os services e handlers?',
    answer: 'sealed class indica que a classe não deve ser herdada — é uma decisão de design explícita. No contexto de DI com interfaces, herdar de EmpresaAppService não faz sentido porque o contrato público é IEmpresaAppService. Também permite ao compilador e runtime fazer otimizações (devirtualização de métodos), melhorando performance.',
  },
  {
    id: 12,
    category: 'C#',
    question: 'O que é um IPipelineBehavior e qual design pattern ele implementa?',
    answer: 'IPipelineBehavior é a interface do MediatR para interceptadores de pipeline — implementa o Decorator Pattern. Cada behavior envolve o próximo em uma cadeia: Behavior1(Behavior2(Handler)). O ValidationBehavior intercepta ANTES do handler, valida os dados, e chama next() para continuar. Isso é cross-cutting concern sem poluir o handler com lógica de validação.',
  },
];

// ─── Conceitos de C# ──────────────────────────────────────────────────────────

export interface CSharpConcept {
  keyword: string;
  name: string;
  explanation: string;
  code: string;
  file: string;
  why: string;
}

export const CSHARP_CONCEPTS: CSharpConcept[] = [
  {
    keyword: 'interface',
    name: 'Interface — Contrato sem Implementação',
    explanation: 'Uma interface define UM CONTRATO: "quem implementar isso, DEVE ter esses métodos." Ela não tem código, só assinaturas. Isso permite o DIP: o Handler depende de IEmpresaRepository (abstração), não de EmpresaRepository (concreção com EF Core). Você pode trocar o banco sem mudar o Domain.',
    code: `// Domain — define o contrato (SEM EF Core)
public interface IEmpresaRepository
{
    Task<bool> ExistsByCnpjAsync(string cnpj);
    void Create(EmpresaModel model);
}

// Infrastructure — implementa o contrato (COM EF Core)
public sealed class EmpresaRepository : IEmpresaRepository
{
    private readonly AppDbContext _context;
    // ... implementação com EF Core aqui
}

// Handler — usa a interface, não a implementação
public CreateEmpresaCommandHandler(IEmpresaRepository repo)
//                                  ^ depende da abstração`,
    file: 'Domain/Empresas/Repositories/IEmpresaRepository.cs',
    why: 'Permite trocar a implementação (EF Core → Dapper, PostgreSQL → MongoDB) sem mudar o Domain. Facilita mocks em testes.',
  },
  {
    keyword: 'abstract class',
    name: 'Abstract Class — Base Reutilizável',
    explanation: 'Uma abstract class é uma classe que NÃO pode ser instanciada diretamente — só serve como base. Ela pode ter implementação parcial (código real) + métodos abstratos (que as subclasses DEVEM implementar). Diferente da interface, ela pode ter estado (campos) e código. Usada para compartilhar comportamento comum entre classes relacionadas.',
    code: `// Classe abstrata — tem implementação + força contrato
public abstract class Command<TResult> : IRequest<TResult>
{
    // Herda de IRequest<TResult> do MediatR
    // Todas as subclasses AUTOMATICAMENTE são roteáveis pelo MediatR
    // SEM código aqui — apenas o contrato genérico
}

// ModelBase — abstract com implementação real
public abstract class ModelBase
{
    public Guid Id { get; set; } = Guid.NewGuid();   // ← código real
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

// Subclasse — herda Id e CreatedAt automaticamente
public sealed class EmpresaModel : ModelBase
{
    public string CNPJ { get; set; } = string.Empty;
    // Id e CreatedAt já estão aqui (herdados)
}`,
    file: 'Domain/Shared/Commands/Command.cs',
    why: 'Evita duplicar Id/CreatedAt em todo model. Command<T> garante que todo command é reconhecido pelo MediatR sem código extra.',
  },
  {
    keyword: 'sealed class',
    name: 'Sealed Class — Impede Herança',
    explanation: 'sealed class diz explicitamente: "esta classe NÃO deve ser herdada." É uma decisão de design — você está dizendo que a classe é completa como está. Também habilita otimizações do JIT (devirtualização). Quando você usa DI com interfaces, herdar da implementação não faz sentido — o contrato é a interface.',
    code: `// Sealed: ninguém pode herdar EmpresaAppService
public sealed class EmpresaAppService : IEmpresaAppService
{
    // O contrato público É a interface IEmpresaAppService
    // Não faz sentido criar "EmpresaAppServiceExtended : EmpresaAppService"
    // Se precisar de variação, cria outra implementação de IEmpresaAppService
}

// Comparação:
// class      → pode ser herdada (default)
// sealed     → NÃO pode ser herdada (explícito)
// abstract   → NÃO pode ser instanciada, DEVE ser herdada

// UnitOfWork também é sealed — implementação final
public sealed class UnitOfWork : IUnitOfWork { }`,
    file: 'Application/Empresas/Services/EmpresaAppService.cs',
    why: 'Comunica intenção de design. Previne herança acidental. Permite otimizações do compilador (métodos não-virtuais são mais rápidos).',
  },
  {
    keyword: 'record',
    name: 'Record — Imutável por Padrão',
    explanation: 'record é um tipo especial de classe/struct focado em DADOS imutáveis. O compilador gera automaticamente: igualdade por valor (dois records com mesmos dados são iguais), ToString() útil, e desconstrutores. Perfeito para Domain Events — uma notificação de "o que aconteceu" não deve ser mutada depois de criada.',
    code: `// Record: compilador gera igualdade, ToString, etc.
public sealed record EmpresaCreatedEvent(
    Guid EmpresaId,
    string CNPJ,
    string RazaoSocial,
    RegimeTributario Regime
) : INotification;

// Criado com positional syntax (como construtor)
var evento = new EmpresaCreatedEvent(model.Id, model.CNPJ, ...);

// Igualdade por VALOR (diferente de class)
var e1 = new EmpresaCreatedEvent(id, "12345", "Padaria", Simples);
var e2 = new EmpresaCreatedEvent(id, "12345", "Padaria", Simples);
Console.WriteLine(e1 == e2); // true ← record compara campos
// Com class, seria false (compara referência)`,
    file: 'Domain/Empresas/Events/EmpresaCreatedEvent.cs',
    why: 'Imutabilidade garante que o evento não é modificado depois de publicado. Igualdade por valor facilita testes (comparar eventos esperados vs recebidos).',
  },
  {
    keyword: 'generics <T>',
    name: 'Generics — Código Reutilizável Tipado',
    explanation: 'Generics permitem criar código que funciona com QUALQUER tipo, mantendo type safety. Em vez de repetir a mesma estrutura para cada Command, você cria Command<TResult> onde TResult é o tipo de retorno. O compilador substitui T pelo tipo real em tempo de compilação — sem boxing, sem cast, sem erros em runtime.',
    code: `// Sem generics — repetição de código para cada tipo
public class CreateEmpresaCommand { } // retorna o quê?
public class DeleteEmpresaCommand { } // retorna o quê?

// Com generics — um template para todos
public abstract class Command<TResult> : IRequest<TResult> { }

// O tipo TResult é definido ao criar o Command concreto:
public sealed class CreateEmpresaCommand
    : Command<EmpresaModel>  // ← TResult = EmpresaModel
{
    public string CNPJ { get; set; } = string.Empty;
}

// O MediatR usa TResult para rotear pro handler correto:
// IRequestHandler<CreateEmpresaCommand, EmpresaModel>
//                                       ^ mesmo TResult

// ValidationBehavior genérico — roda para QUALQUER Command
public sealed class ValidationBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>`,
    file: 'Domain/Shared/Commands/Command.cs',
    why: 'Evita duplicar o pipeline para cada tipo de command. Type safety: o compilador garante que o handler retorna EmpresaModel, não object.',
  },
  {
    keyword: 'constructor injection',
    name: 'Constructor Injection — Como o DI Resolve',
    explanation: 'O DI Container do ASP.NET resolve as dependências automaticamente via construtor. Quando você pede IEmpresaAppService no endpoint, o DI olha o registro (EmpresaSetup.cs), cria EmpresaAppService, e para criá-lo precisa de IMediatrService e IMapper — resolve esses também, em cadeia. Isso é o "Composition Root": o DI monta o grafo de objetos.',
    code: `// 1. Registro no IoC (feito uma vez no startup)
services.AddScoped<IEmpresaAppService, EmpresaAppService>();
services.AddScoped<IMediatrService, MediatrService>();
// AddScoped = uma instância por HTTP request

// 2. Constructor injection — o DI injeta automaticamente
public sealed class EmpresaAppService : IEmpresaAppService
{
    private readonly IMediatrService _mediator;
    private readonly IMapper _mapper;

    // DI chama esse construtor e injeta as dependências
    public EmpresaAppService(IMediatrService mediator, IMapper mapper)
    {
        _mediator = mediator;
        _mapper = mapper;
    }
}

// 3. No endpoint — o DI injeta IEmpresaAppService
private static async Task<IResult> CreateEmpresaAsync(
    CreateEmpresaViewModel payload,
    IEmpresaAppService appService, // ← DI injeta aqui
    CancellationToken ct) { ... }`,
    file: 'Infrastructure.CrossCutting.IoC/Empresas/EmpresaSetup.cs',
    why: 'Inversão de controle: a classe não cria suas dependências, elas são fornecidas. Facilita testes (injeta mocks), reduz acoplamento.',
  },
  {
    keyword: 'Scoped / Singleton / Transient',
    name: 'Lifetimes do DI — Quanto Dura o Objeto',
    explanation: 'O DI Container controla quando criar e destruir objetos. Scoped cria UMA instância por HTTP request — perfeito para DbContext e Repositories que precisam da mesma instância na mesma request (Unit of Work). Singleton cria UMA vez para toda a vida do app. Transient cria um novo objeto toda vez que é pedido.',
    code: `// SCOPED — uma instância por HTTP request (mais comum)
services.AddScoped<IEmpresaRepository, EmpresaRepository>();
services.AddScoped<IUnitOfWork, UnitOfWork>();
services.AddScoped<AppDbContext>(); // ← mesmo DbContext na request
// Handler → Repository → UnitOfWork: todos usam O MESMO DbContext
// (por isso o commit do UoW afeta o que o Repository rastreou)

// SINGLETON — uma instância em todo o app
services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
// Sem estado mutável → seguro ser singleton

// TRANSIENT — nova instância toda vez que pedida
// (raramente usado — geralmente para objetos leves sem estado)

// CUIDADO: Singleton NÃO pode depender de Scoped
// O Singleton vive mais do que a request → vazamento de DbContext`,
    file: 'Infrastructure.CrossCutting.IoC/ProjectBootstrapper.cs',
    why: 'A escolha errada causa bugs difíceis: Scoped como Singleton = DbContext compartilhado entre requests (concorrência). Transient no DbContext = SaveChanges em contextos diferentes = UoW quebra.',
  },
  {
    keyword: 'async / await',
    name: 'Async/Await + CancellationToken',
    explanation: 'async/await libera a thread enquanto aguarda I/O (banco, HTTP, disco). Sem async, a thread fica bloqueada esperando — em um servidor com 100 requests simultâneas, você precisaria de 100 threads. Com async, a mesma thread pode processar outras requests enquanto aguarda o banco. CancellationToken permite cancelar operações se o cliente desconectar.',
    code: `// Sem async: thread bloqueada durante query (ruim em produção)
public EmpresaModel Handle(CreateEmpresaCommand command)
{
    var exists = _repo.ExistsByCnpj(cnpj); // thread bloqueada aqui
    _uow.Complete(); // thread bloqueada aqui também
    return model;
}

// Com async: thread liberada durante I/O (correto)
public async Task<EmpresaModel> Handle(
    CreateEmpresaCommand command,
    CancellationToken ct) // ← client desconectou? cancela tudo
{
    var exists = await _repo.ExistsByCnpjAsync(cnpj, ct);
    //           ^ thread liberada, processa outras requests
    await _uow.CompleteAsync(ct);
    //    ^ thread liberada novamente
    return model;
}`,
    file: 'Domain/Empresas/CommandHandlers/CreateEmpresaCommandHandler.cs',
    why: 'Escalabilidade: com async, um servidor com 8 cores pode atender milhares de requests simultâneas (I/O-bound). O CancellationToken evita processar requests de clientes que já desconectaram.',
  },
  {
    keyword: 'IPipelineBehavior',
    name: 'IPipelineBehavior — Decorator no MediatR',
    explanation: 'IPipelineBehavior implementa o Decorator Pattern sobre o pipeline do MediatR. Cada behavior "envolve" o próximo: ValidationBehavior chama next() que chama o Handler. É como middlewares do ASP.NET, mas para Commands/Queries. Permite adicionar cross-cutting concerns (logging, validação, retry) sem tocar no Handler.',
    code: `// O pipeline é uma cadeia de behaviors + handler:
// Request → [ValidationBehavior] → [LoggingBehavior?] → [Handler]

public sealed class ValidationBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next, // ← próximo na cadeia
        CancellationToken ct)
    {
        // ANTES do handler: valida
        var failures = await ValidateAsync(request, ct);
        if (failures.Count != 0)
            throw new ValidationException(failures);

        // Chama o próximo (outro behavior ou o Handler)
        return await next();
        // DEPOIS do handler: poderia fazer algo aqui
    }
}

// Registrado como open generic — funciona para QUALQUER Command
services.AddTransient(
    typeof(IPipelineBehavior<,>),
    typeof(ValidationBehavior<,>));`,
    file: 'Domain/Shared/Behaviors/ValidationBehavior.cs',
    why: 'Separa validação do handler (SRP). Novo behavior (ex: logging) adicionado em um arquivo, afeta todos os commands automaticamente.',
  },
  {
    keyword: 'INotification vs IRequest',
    name: 'Command vs Event — Dois Padrões do MediatR',
    explanation: 'IRequest é para Commands/Queries: tem exatamente um handler, tem retorno, e o chamador aguarda o resultado. INotification é para Domain Events: pode ter zero ou N handlers, não tem retorno (void), e é "fire-and-forget". Use IRequest quando você precisa de um resultado. Use INotification para notificar que algo aconteceu (side effects desacoplados).',
    code: `// IRequest — Command (um handler, tem retorno)
public sealed class CreateEmpresaCommand
    : Command<EmpresaModel>  // herda IRequest<EmpresaModel>
//                     ^ handler retorna EmpresaModel

// Um único handler registrado:
public sealed class CreateEmpresaCommandHandler
    : IRequestHandler<CreateEmpresaCommand, EmpresaModel> { }

// ──────────────────────────────────────────────────

// INotification — Event (N handlers, sem retorno)
public sealed record EmpresaCreatedEvent(...) : INotification;
//                                               ^ sem tipo de retorno

// Vários handlers podem escutar:
public sealed class EmpresaCreatedHandler
    : INotificationHandler<EmpresaCreatedEvent> { }
// (indexa Meilisearch)

// Poderia ter outro handler para o mesmo evento:
public sealed class EmpresaCreatedEmailHandler
    : INotificationHandler<EmpresaCreatedEvent> { }
// (envia email de boas-vindas)`,
    file: 'Domain/Empresas/Events/EmpresaCreatedEvent.cs',
    why: 'Separa a operação principal (criar empresa) dos side effects (indexar, enviar email). Adicionar um novo side effect = novo INotificationHandler, sem mudar o Handler original (Open/Closed Principle).',
  },
];

// ─── Fluxos de Erro ───────────────────────────────────────────────────────────

export interface ErrorFlow {
  exception: string;
  statusCode: number;
  httpStatus: string;
  errorCode: string;
  thrownIn: string;
  thrownWhen: string;
  caughtBy: string;
  example: string;
}

export const ERROR_FLOWS: ErrorFlow[] = [
  {
    exception: 'ValidationException',
    statusCode: 400,
    httpStatus: 'Bad Request',
    errorCode: 'Validation',
    thrownIn: 'Domain/Shared/Behaviors/ValidationBehavior.cs',
    thrownWhen: 'CNPJ com formato inválido, RazaoSocial vazia, Regime fora do enum',
    caughtBy: 'Api/Middleware/ExceptionMiddleware.cs',
    example: '{ "success": false, "errorCode": "Validation", "message": "CNPJ inválido; Razão Social é obrigatória." }',
  },
  {
    exception: 'InvalidOperationException',
    statusCode: 409,
    httpStatus: 'Conflict',
    errorCode: 'Conflict',
    thrownIn: 'Domain/Empresas/CommandHandlers/CreateEmpresaCommandHandler.cs',
    thrownWhen: 'CNPJ já existe no banco (regra de negócio)',
    caughtBy: 'Api/Middleware/ExceptionMiddleware.cs',
    example: '{ "success": false, "errorCode": "Conflict", "message": "CNPJ já cadastrado." }',
  },
  {
    exception: 'KeyNotFoundException',
    statusCode: 404,
    httpStatus: 'Not Found',
    errorCode: 'NotFound',
    thrownIn: 'Domain/Empresas/CommandHandlers/ (ex: DeleteEmpresaCommandHandler)',
    thrownWhen: 'Buscar ou deletar empresa com ID que não existe',
    caughtBy: 'Api/Middleware/ExceptionMiddleware.cs',
    example: '{ "success": false, "errorCode": "NotFound", "message": "Empresa não encontrada." }',
  },
  {
    exception: 'Exception (genérica)',
    statusCode: 500,
    httpStatus: 'Internal Server Error',
    errorCode: 'InternalError',
    thrownIn: 'Qualquer camada',
    thrownWhen: 'Banco fora do ar, bug inesperado, timeout de conexão',
    caughtBy: 'Api/Middleware/ExceptionMiddleware.cs',
    example: '{ "success": false, "errorCode": "InternalError", "message": "Erro interno." }',
  },
];

export const GOLD = '#D4A843';

export const PHASE_COLORS = [
  { bg: 'rgba(33,150,243,0.12)', border: '#2196F3', glow: 'rgba(33,150,243,0.3)' },
  { bg: 'rgba(76,175,80,0.12)', border: '#4CAF50', glow: 'rgba(76,175,80,0.3)' },
  { bg: 'rgba(255,193,7,0.12)', border: '#FFC107', glow: 'rgba(255,193,7,0.3)' },
  { bg: 'rgba(255,152,0,0.12)', border: '#FF9800', glow: 'rgba(255,152,0,0.3)' },
  { bg: 'rgba(244,67,54,0.12)', border: '#F44336', glow: 'rgba(244,67,54,0.3)' },
];

// ============================================================
// 🟡 FASE 3.4 — CommandHandler (O Coração do Sistema)
// ============================================================
//
// Responsabilidade: ✅ REGRA DE NEGÓCIO PURA
//                   ✅ Toda lógica importante fica AQUI
//
// FLUXO COMPLETO (7 passos):
//   1. Validação de NEGÓCIO (CNPJ duplicado)
//   2. Cria o Model de domínio (command.ToModel())
//   3. Persiste no repositório (ChangeTracker, sem banco)
//   4. Gera obrigações fiscais (Rules Engine)
//   5. Persiste obrigações (ChangeTracker)
//   6. COMMIT ÚNICO (UnitOfWork.CompleteAsync = SaveChanges)
//   7. Publica Domain Event (side effects: indexar, limpar cache)
//
// IRequestHandler<TCommand, TResponse> é a interface do MediatR
//   TCommand = CreateEmpresaCommand (o que chega)
//   TResponse = EmpresaModel (o que retorna)
//   O MediatR encontra esse handler automaticamente pelo tipo do Command
// ============================================================

using MediatR;
using PainelObrigacoes.Domain.Empresas.Commands;
using PainelObrigacoes.Domain.Empresas.Events;
using PainelObrigacoes.Domain.Empresas.Models;
using PainelObrigacoes.Domain.Empresas.Repositories;
using PainelObrigacoes.Domain.Obrigacoes.Models;
using PainelObrigacoes.Domain.Obrigacoes.Repositories;
using PainelObrigacoes.Domain.Obrigacoes.Services;
using PainelObrigacoes.Domain.Shared.Interfaces;

namespace PainelObrigacoes.Domain.Empresas.CommandHandlers;

public sealed class CreateEmpresaCommandHandler
    : IRequestHandler<CreateEmpresaCommand, EmpresaModel>
{
    // 🟡 CONSTRUTOR: TODAS as dependências são injetadas pelo DI
    //
    // Isso é a aplicação do DIP (Dependency Inversion Principle):
    //   O Handler (alto nível) depende de INTERFACES (abstrações)
    //   não de implementações concretas (baixo nível)
    //
    // Cada dependência tem um papel específico (SRP — Single Responsibility):

    private readonly IUnitOfWork _unitOfWork;            // Commit único (SaveChanges)
    private readonly IEmpresaRepository _empresaRepository;   // Acesso a dados de empresa
    private readonly IObrigacaoRepository _obrigacaoRepository; // Acesso a dados de obrigação
    private readonly ITributaryRulesEngine _rulesEngine;       // Motor de regras fiscais
    private readonly IMediator _mediator;              // Publicar eventos de domínio
    private readonly IDateTimeProvider _clock;         // Data/hora atual (testável)

    public CreateEmpresaCommandHandler(
        IUnitOfWork unitOfWork,
        IEmpresaRepository empresaRepository,
        IObrigacaoRepository obrigacaoRepository,
        ITributaryRulesEngine rulesEngine,
        IMediator mediator,
        IDateTimeProvider clock)
    {
        _unitOfWork = unitOfWork;
        _empresaRepository = empresaRepository;
        _obrigacaoRepository = obrigacaoRepository;
        _rulesEngine = rulesEngine;
        _mediator = mediator;
        _clock = clock;
    }

    // 🟢 Handle: executado pelo MediatR DEPOIS do ValidationBehavior
    //
    // command = CreateEmpresaCommand (já validado pelo FluentValidation)
    // cancellationToken = pra cancelar se o cliente desconectar
    public async Task<EmpresaModel> Handle(
        CreateEmpresaCommand command, CancellationToken cancellationToken)
    {
        // ================================================================
        // PASSO 1: VALIDAÇÃO DE NEGÓCIO
        // ================================================================
        // Diferença do ValidationBehavior:
        //   ValidationBehavior validou FORMATO do CNPJ (tem 14 dígitos?)
        //   Handler valida NEGÓCIO (CNPJ já existe no banco?)
        //
        // Essa validação precisa consultar o banco → NÃO pode estar no validator
        // Se o CNPJ já existe → InvalidOperationException → 409 Conflict
        // ================================================================
        var cnpjLimpo = command.CNPJ.Replace(".", "").Replace("/", "").Replace("-", "");

        if (await _empresaRepository.ExistsByCnpjAsync(cnpjLimpo))
            throw new InvalidOperationException("CNPJ já cadastrado.");

        // ================================================================
        // PASSO 2: CRIA O MODEL DE DOMÍNIO
        // ================================================================
        // command.ToModel() limpa os dados (CNPJ sem pontuação, trim)
        var model = command.ToModel();

        // ================================================================
        // PASSO 3: PERSISTE A EMPRESA (ChangeTracker apenas)
        // ================================================================
        // NÃO chama SaveChanges aqui!
        // Só adiciona no ChangeTracker do EF Core (memória)
        // O SaveChanges será chamado no PASSO 6 (UnitOfWork)
        _empresaRepository.Create(model);

        // ================================================================
        // PASSO 4: GERA OBRIGAÇÕES FISCAIS
        // ================================================================
        // TributaryRulesEngine decide quais obrigações gerar baseado no:
        //   - Regime tributário (Simples Nacional, Lucro Presumido, etc.)
        //   - Período (mês atual até dezembro)
        //
        // Exemplo: Se for Simples Nacional → gera DAS + eSocial
        //          Se for Imunidade/Isenção → não gera nada
        var obrigacoes = new List<ObrigacaoModel>();
        for (int mes = _clock.CurrentMonth; mes <= 12; mes++)
            obrigacoes.AddRange(_rulesEngine.GenerateObrigacoes(model, _clock.CurrentYear, mes));

        // ================================================================
        // PASSO 5: PERSISTE AS OBRIGAÇÕES (ChangeTracker apenas)
        // ================================================================
        _obrigacaoRepository.CreateRange(obrigacoes);

        // ================================================================
        // PASSO 6: COMMIT ÚNICO — SAVECHANGES
        // ================================================================
        // Por que UM SaveChanges só?
        //   - Se a empresa for salva e as obrigações NÃO → dados inconsistentes
        //   - Com um SaveChanges só: TUDO é salvo OU NADA é salvo
        //   - Isso é atomicidade de transação
        //
        // UnitOfWork é o ÚNICO lugar em todo o sistema que chama SaveChanges
        // Repository NUNCA chama SaveChanges (regra de ouro)
        await _unitOfWork.CompleteAsync(cancellationToken);

        // ================================================================
        // PASSO 7: PUBLICA DOMAIN EVENT (side effects)
        // ================================================================
        // INotification (evento) é diferente de IRequest (command):
        //   Command: "FAÇA ISSO AGORA E ME DÊ O RESULTADO" (síncrono, tem retorno)
        //   Event:   "ISSO ACONTECEU, QUEM SE IMPORTAR QUE TRATE" (assíncrono, sem retorno)
        //
        // O que o EmpresaCreatedEvent faz:
        //   1. Indexa a empresa no Meilisearch (busca full-text)
        //   2. Invalida cache do Redis (dashboard + alertas)
        //
        // Se o Meilisearch falhar → a empresa ainda foi criada ✅
        // Isso é eventual consistency = "efeito colateral não bloqueante"
        await _mediator.Publish(
            new EmpresaCreatedEvent(model.Id, model.CNPJ, model.RazaoSocial, model.Regime),
            cancellationToken);

        // ================================================================
        // PASSO 8: RETORNA O MODEL
        // ================================================================
        // O Model volta pelo pipeline:
        //   Handler → MediatR → MediatrService → AppService
        //   AppService: AutoMapper converte Model → ResultViewModel
        //   Endpoint: ToOkResponse() envelopa em ResponseData
        //   HTTP: 200 OK { success: true, data: { id, cnpj, ... } }
        return model;
    }
}

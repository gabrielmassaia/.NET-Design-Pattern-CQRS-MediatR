// ============================================================
// 🟡 FASE 3.2 — ValidationBehavior (Pipeline do MediatR)
// ============================================================
//
// Responsabilidade: "Fiscal de carteirinha — valida ANTES do handler rodar"
// O que faz:        Executa FluentValidation automaticamente em TODO Command
//
// FLUXO:
//   MediatR recebe o Command
//     → ValidationBehavior pega TODOS os IValidator<TCommand>
//     → Roda ValidateAsync() em paralelo
//     → Se algum erro: throw ValidationException → 400 BadRequest
//     → Se OK: chama next() → vai pro Handler
//
// DIFERENÇA CRÍTICA:
//   ValidationBehavior = validação de CAMPO (formato CNPJ, obrigatoriedade)
//   Handler            = validação de NEGÓCIO (CNPJ duplicado, regras fiscais)
//   Separar permite que a validação de campo seja cross-cutting (reutilizável)
//
// COMO É REGISTRADO:
//   ProjectBootstrapper.cs:
//     services.AddMediatR(cfg => cfg.AddBehavior(typeof(IPipelineBehavior<,>),
//                              typeof(ValidationBehavior<,>)));
//     services.AddValidatorsFromAssembly(domainAssembly);
// ============================================================

using FluentValidation;
using MediatR;

namespace PainelObrigacoes.Domain.Shared.Behaviors;

// IPipelineBehavior<TRequest, TResponse> é a interface do MediatR para "interceptadores"
// TRequest = o tipo do Command (ex: CreateEmpresaCommand)
// TResponse = o tipo do retorno (ex: EmpresaModel)
public sealed class ValidationBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    // DI: injeta TODOS os validators que existem para TRequest
    // Se TRequest é CreateEmpresaCommand, vai receber CreateEmpresaCommandValidation
    // Se não existir validator nenhum, a lista vem vazia
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    // 🟡 CONSTRUTOR: DI injeta todos os validators do tipo TRequest
    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
        => _validators = validators;

    // 🟡 Handle: executa a validação
    //
    // request = o Command (ex: CreateEmpresaCommand com CNPJ, RazaoSocial, Regime)
    // next    = função que chama o próximo passo (o Handler)
    // cancellationToken = pra cancelar se o cliente desconectar
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        // Se não tem validator pra esse tipo de comando, passa direto
        if (!_validators.Any())
            return await next();

        // Cria o contexto de validação com os dados do Command
        var context = new ValidationContext<TRequest>(request);

        // Roda TODOS os validators EM PARALELO (Task.WhenAll)
        // Junta todos os erros encontrados
        var failures = (await Task.WhenAll(
                _validators.Select(v => v.ValidateAsync(context, cancellationToken))))
            .SelectMany(result => result.Errors)
            .Where(f => f is not null)
            .ToList();

        // Se encontrou erros de validação → LANÇA EXCEÇÃO
        // O ExceptionMiddleware (FASE 5.3) vai capturar:
        //   ValidationException → 400 BadRequest + ErrorCode.Validation
        if (failures.Count != 0)
            throw new ValidationException(failures);

        // Tudo válido! Chama o próximo passo → Handler
        return await next();
    }
}

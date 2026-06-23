// ============================================================
// 🟡 FASE 3.1 — Ponte Application → Domain (MediatrService)
// ============================================================
//
// Responsabilidade: "Despachante do MediatR"
// O que faz:        Ponte entre o AppService (Application) e o MediatR (biblioteca)
//
// POR QUE ISSO EXISTE?
//   A Clean Architecture diz que o Domain NÃO pode depender de frameworks externos
//   Mas o MediatR é um framework externo (biblioteca NuGet)
//   Então a INTERFACE IMediatrService fica no Domain (abstração)
//   E a IMPLEMENTAÇÃO MediatrService fica no IoC (infraestrutura)
//
//   Isso é a aplicação do DIP (Dependency Inversion Principle):
//     - Módulos de alto nível (Domain) definem interfaces
//     - Módulos de baixo nível (IoC) implementam
//     - Ambos dependem de abstrações, não de implementações concretas
//
// FLUXO:
//   AppService → IMediatrService.SendCommand() → MediatrService.SendCommand()
//   → IMediator.Send() (MediatR raiz) → ValidationBehavior → Handler
// ============================================================

using MediatR;
using CleanArchReference.Domain.Shared.Commands;
using CleanArchReference.Domain.Shared.Interfaces;
using CleanArchReference.Domain.Shared.Queries;

namespace CleanArchReference.Infrastructure.CrossCutting.IoC;

public sealed class MediatrService : IMediatrService
{
    // IMediator é a interface principal do MediatR (biblioteca externa)
    // Faz parte do pacote MediatR (NuGet)
    private readonly IMediator _mediator;

    // 🟡 CONSTRUTOR: DI injeta o IMediator do MediatR
    // O MediatR foi configurado no ProjectBootstrapper.cs com RegisterServicesFromAssemblies
    // para saber onde encontrar os Handlers
    public MediatrService(IMediator mediator) => _mediator = mediator;

    // SendCommand: envia um Command (escrita) pelo pipeline do MediatR
    //
    // O MediatR vai:
    //   1. Rodar ValidationBehavior (se existir validator pra esse Command)
    //   2. Encontrar o Handler correto (IRequestHandler<CreateEmpresaCommand, EmpresaModel>)
    //   3. Executar o Handler
    //   4. Retornar o resultado
    public Task<TResult> SendCommand<TResult>(
        Command<TResult> command,
        CancellationToken cancellationToken = default)
        => _mediator.Send(command, cancellationToken);

    // SendQuery: envia uma Query (leitura) pelo pipeline do MediatR
    // Mesmo fluxo do SendCommand, mas semanticamente é uma operação de leitura
    public Task<TResult> SendQuery<TResult>(
        Query<TResult> query,
        CancellationToken cancellationToken = default)
        => _mediator.Send(query, cancellationToken);
}

// ============================================================
// 🟡 FASE 3 — Interface do MediatrService (Definida no Domain)
// ============================================================
//
// Responsabilidade: "Contrato da ponte entre Application e MediatR"
//
// POR QUE ISSO EXISTE?
//
// A Clean Architecture diz: o Domain NÃO pode depender de frameworks externos
// Mas o MediatR é um framework externo (biblioteca NuGet)
//
// Solução:
//   A INTERFACE fica no Domain (abstração pura, sem dependências)
//   A IMPLEMENTAÇÃO fica no IoC (MediatrService.cs)
//
//   AppService chama IMediatrService (interface no Domain)
//   → MediatrService implementa (no IoC)
//   → MediatrService chama IMediator do MediatR (biblioteca externa)
//
// Isso é DIP: o Domain controla o contrato, a infraestrutura implementa
//
// Implementação: Infrastructure.CrossCutting.IoC/MediatrService.cs
// ============================================================

using CleanArchReference.Domain.Shared.Commands;
using CleanArchReference.Domain.Shared.Queries;

namespace CleanArchReference.Domain.Shared.Interfaces;

public interface IMediatrService
{
    // SendCommand: envia um Command de ESCRITA (Create, Update, Delete)
    // Command<TResult> herda de IRequest<TResult> (MediatR)
    Task<TResult> SendCommand<TResult>(
        Command<TResult> command,
        CancellationToken cancellationToken = default);

    // SendQuery: envia uma Query de LEITURA (Find, Get, Search)
    // Query<TResult> herda de IRequest<TResult> (MediatR)
    Task<TResult> SendQuery<TResult>(
        Query<TResult> query,
        CancellationToken cancellationToken = default);
}

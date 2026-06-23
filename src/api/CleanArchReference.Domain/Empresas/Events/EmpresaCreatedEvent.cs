// ============================================================
// 🟡 FASE 3.4 — Domain Event (Side Effect)
// ============================================================
//
// Responsabilidade: "Avisar que uma empresa foi criada"
//
// INotification é a interface do MediatR para EVENTOS
// DIFERENÇA de IRequest (Command/Query):
//
//   IRequest (Command/Query):
//     - "FAÇA ISSO E ME DÊ O RESULTADO"
//     - Tem retorno (Task<TResult>)
//     - Quem chama espera o resultado
//     - Ex: CreateEmpresaCommand → retorna EmpresaModel
//
//   INotification (Event):
//     - "ISSO ACONTECEU, QUEM SE IMPORTAR QUE TRATE"
//     - Não tem retorno (Task)
//     - Quem publica não espera (fire-and-forget)
//     - Ex: EmpresaCreatedEvent → indexa no Meilisearch
//
// Vários handlers podem escutar o MESMO evento:
//   1. EmpresaCreatedHandler → indexa no Meilisearch
//   2. (futuro) OutroHandler → envia email, etc.
// ============================================================

using MediatR;
using CleanArchReference.Domain.Enums;

namespace CleanArchReference.Domain.Empresas.Events;

// Record: tipo imutável do C# (propriedades readonly por padrão)
// INotification: interface do MediatR para eventos
public sealed record EmpresaCreatedEvent(
    Guid EmpresaId,
    string CNPJ,
    string RazaoSocial,
    RegimeTributario Regime) : INotification;

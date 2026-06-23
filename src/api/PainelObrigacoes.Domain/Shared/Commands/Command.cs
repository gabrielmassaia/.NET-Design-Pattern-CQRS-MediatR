// ============================================================
// 📦 BLOCO DE CONSTRUÇÃO — Command (Base para Todos os Commands)
// ============================================================
//
// Responsabilidade: "Classe base para TODOS os Commands do sistema"
//
// Command<TResult>:
//   - Representa uma INTENÇÃO DE ESCRITA (Create, Update, Delete)
//   - Herda de IRequest<TResult> (MediatR) para ser processado pelo pipeline
//   - O MediatR encontra o handler baseado no tipo do Command
//
// DIFERENÇA DE Query:
//   Command: Muda o estado do sistema (escrita)
//   Query:  Consulta dados sem alterar estado (leitura)
//
// ISSO É CQRS: Command Query Responsibility Segregation
// ============================================================

using MediatR;

namespace PainelObrigacoes.Domain.Shared.Commands;

// IRequest<TResult>: interface do MediatR que diz:
//   "essa classe pode ser ENVIADA pelo MediatR"
//   "e retorna algo do tipo TResult"
//
// Ex: CreateEmpresaCommand : Command<EmpresaModel>
//   → pode ser enviado pelo MediatR
//   → retorna EmpresaModel
public abstract class Command<TResult> : IRequest<TResult> { }

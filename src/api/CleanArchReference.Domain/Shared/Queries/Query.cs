// ============================================================
// 📦 BLOCO DE CONSTRUÇÃO — Query (Base para Todas as Queries)
// ============================================================
//
// Responsabilidade: "Classe base para TODAS as Queries do sistema"
//
// Query<TResult>:
//   - Representa uma CONSULTA (leitura de dados)
//   - NÃO altera estado do sistema
//   - Herda de IRequest<TResult> (MediatR) para ser processado pelo pipeline
//
// DIFERENÇA DE Command:
//   Command: "Execute esta ação" (Create, Update, Delete)
//   Query:  "Me dê estes dados" (Find, Get, Search)
//
// ISSO É CQRS: separar reads de writes permite:
//   1. Otimizar cada lado independentemente
//   2. Usar modelos de leitura diferentes dos de escrita
//   3. Pipeline de validação diferente (Query não precisa de tanto validation)
// ============================================================

using MediatR;

namespace CleanArchReference.Domain.Shared.Queries;

// IRequest<TResult>: interface do MediatR que diz:
//   "essa classe pode ser ENVIADA pelo MediatR"
//   "e retorna algo do tipo TResult"
//
// Ex: FindEmpresasQuery : Query<IList<EmpresaModel>>
//   → retorna uma lista de empresas
public abstract class Query<TResult> : IRequest<TResult> { }

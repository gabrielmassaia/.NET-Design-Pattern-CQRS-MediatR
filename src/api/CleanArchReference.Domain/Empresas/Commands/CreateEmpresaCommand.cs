// ============================================================
// 🟡 FASE 3.3 — Command (O Pedido)
// ============================================================
//
// Responsabilidade: "Dados da intenção de criar empresa"
// O que contém:    Só os dados necessários + método de conversão
// O que NÃO tem:   Lógica de negócio, acesso a banco, validação complexa
//
// DIFERENÇA DE ViewModel:
//   CreateEmpresaViewModel (Application):
//     - Pode ter CNPJ formatado "11.222.333/0001-81"
//     - Vive na Application layer (perto do HTTP)
//   CreateEmpresaCommand (Domain):
//     - Deve ter dados limpos para o domínio processar
//     - Vive no Domain layer (coração do sistema)
//     - Pode ter MÉTODOS de conversão (ToModel)
//
// Por que separar? Clean Architecture: cada camada tem seu próprio "dialeto"
// ============================================================

using CleanArchReference.Domain.Enums;
using CleanArchReference.Domain.Empresas.Models;
using CleanArchReference.Domain.Shared.Commands;

namespace CleanArchReference.Domain.Empresas.Commands;

// Herda de Command<T>, que herda de IRequest<T> (MediatR)
// IRequest<T> = "isso pode ser processado pelo MediatR e retorna algo do tipo T"
// T = EmpresaModel (o tipo de retorno)
public sealed class CreateEmpresaCommand : Command<EmpresaModel>
{
    // Propriedades com os dados da empresa (vindos do ViewModel via AutoMapper)
    public string CNPJ { get; set; } = string.Empty;
    public string RazaoSocial { get; set; } = string.Empty;
    public RegimeTributario Regime { get; set; }

    // 🟡 ToModel(): converte o Command na entidade de domínio (Model)
    //
    // Aqui é onde a "limpeza" dos dados acontece:
    //   - CNPJ: remove pontuação (."-/") pra salvar só números no banco
    //   - RazaoSocial: remove espaços extras no início/fim
    //
    // Isso é chamado pelo Handler (FASE 3.4) depois da validação
    public EmpresaModel ToModel() => new()
    {
        CNPJ = CNPJ.Replace(".", "").Replace("/", "").Replace("-", ""),
        RazaoSocial = RazaoSocial.Trim(),
        Regime = Regime
    };
}

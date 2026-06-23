// ============================================================
// 🟢 FASE 2 — EmpresaResultViewModel (Contrato de Saída)
// ============================================================
//
// Responsabilidade: "O que a API devolve pro frontend"
// Diferença do CreateEmpresaViewModel (entrada):
//   Entrada  → não tem Id, não tem CreatedAt
//   Saída    → TEM Id (gerado pelo banco) e CreatedAt (data da criação)
//
// Isso mostra por que NÃO podemos usar o mesmo objeto pra entrada e saída:
//   - O cliente não envia Id (não sabe qual vai ser)
//   - O cliente não envia CreatedAt (quem define é o sistema)
//   - Objetos diferentes = contratos diferentes = API mais clara
// ============================================================

using CleanArchReference.Domain.Enums;

namespace CleanArchReference.Application.Empresas.ViewModels;

public sealed class EmpresaResultViewModel
{
    public Guid Id { get; set; }
    public string CNPJ { get; set; } = string.Empty;
    public string RazaoSocial { get; set; } = string.Empty;
    public RegimeTributario Regime { get; set; }
    public DateTime CreatedAt { get; set; }
}

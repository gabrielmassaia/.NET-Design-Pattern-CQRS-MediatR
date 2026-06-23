// ============================================================
// 🟢 FASE 2 — CreateEmpresaViewModel (Contrato de Entrada)
// ============================================================
//
// Responsabilidade: "O que o cliente (frontend) envia no HTTP"
// O que é:         O JSON que chega no POST /api/empresas é
//                  desserializado NESTE objeto pelo ASP.NET
//
// Exemplo de JSON que vira esse objeto:
//   { "cnpj": "11.222.333/0001-81",
//     "razaoSocial": "Padaria São João",
//     "regime": 0 }
//
// OBS: Pode ter CNPJ FORMATADO com pontuação
//      A limpeza (remover ./-/) acontece no Command.ToModel()
//
// Diferença de CreateEmpresaCommand (Domain):
//   ViewModel = "dado do jeito que o HTTP manda" (Application)
//   Command   = "dado do jeito que o Domain processa" (Domain)
//   AutoMapper faz a ponte entre os dois
// ============================================================

using CleanArchReference.Domain.Enums;

namespace CleanArchReference.Application.Empresas.ViewModels;

public sealed class CreateEmpresaViewModel
{
    public string CNPJ { get; set; } = string.Empty;
    public string RazaoSocial { get; set; } = string.Empty;
    public RegimeTributario Regime { get; set; }
}

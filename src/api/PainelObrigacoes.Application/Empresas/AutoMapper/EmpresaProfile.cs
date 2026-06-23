// ============================================================
// 🔴 FASE 5.1 — AutoMapper Profile (Tradutor Automático)
// ============================================================
//
// Responsabilidade: "Define as regras de tradução entre objetos de camadas diferentes"
//
// DUAS TRADUÇÕES:
//
// 1. CreateEmpresaViewModel → CreateEmpresaCommand
//    Application → Domain
//    "O que chegou do HTTP vira o que o Domain processa"
//    Copia: CNPJ, RazaoSocial, Regime
//
// 2. EmpresaModel → EmpresaResultViewModel
//    Domain → Application
//    "O que o Domain retornou vira o que o HTTP devolve"
//    Copia: Id, CNPJ, RazaoSocial, Regime, CreatedAt
//
// Registrado no DI via: ProjectBootstrapper.cs
//   services.AddAutoMapper(assembly)
// ============================================================

using AutoMapper;
using PainelObrigacoes.Application.Empresas.ViewModels;
using PainelObrigacoes.Domain.Empresas.Commands;
using PainelObrigacoes.Domain.Empresas.Models;

namespace PainelObrigacoes.Application.Empresas.AutoMapper;

// Profile: classe base do AutoMapper que agrupa regras de mapeamento
public sealed class EmpresaProfile : Profile
{
    public EmpresaProfile()
    {
        // 🟢 Regra 1: ViewModel (entrada HTTP) → Command (Domain)
        //   Propriedades com mesmo nome são copiadas automaticamente
        //   CreateEmpresaViewModel.CNPJ → CreateEmpresaCommand.CNPJ
        CreateMap<CreateEmpresaViewModel, CreateEmpresaCommand>();

        // 🔴 Regra 2: Model (Domain) → ResultViewModel (saída HTTP)
        //   EmpresaModel.Id → EmpresaResultViewModel.Id
        //   EmpresaModel.CNPJ → EmpresaResultViewModel.CNPJ
        //   etc.
        CreateMap<EmpresaModel, EmpresaResultViewModel>();
    }
}

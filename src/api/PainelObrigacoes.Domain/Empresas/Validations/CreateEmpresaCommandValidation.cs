// ============================================================
// 🟡 FASE 3.2 — Validator (Validação de CAMPOS)
// ============================================================
//
// Responsabilidade: Validar FORMATO dos dados, NÃO lógica de negócio
// Quando roda:     No ValidationBehavior, ANTES do handler
//
// O que valida AQUI vs o que valida no HANDLER:
//
// ┌──────────────────────────────┬──────────────────────────────────┐
// │ VALIDATOR (aqui)             │ HANDLER (lá no handler)          │
// ├──────────────────────────────┼──────────────────────────────────┤
// │ CNPJ é obrigatório?          │ CNPJ já existe no banco?        │
// │ Formato do CNPJ é válido?    │ (precisa consultar o banco)     │
// │ Razão social tem 300 chars?  │ Regime permite criar empresa?   │
// │ Regime é um enum válido?     │                                  │
// └──────────────────────────────┴──────────────────────────────────┘
//
// Por que separar?
//   - Validação de campo é CROSS-CUTTING (reutilizável)
//   - Validação de negócio é ESPECÍFICA do fluxo
//   - O ValidationBehavior (pipeline) executa isso automaticamente
//   - Se falhar → throw ValidationException → 400 BadRequest
// ============================================================

using FluentValidation;
using PainelObrigacoes.Domain.Empresas.Commands;

namespace PainelObrigacoes.Domain.Empresas.Validations;

// AbstractValidator<T> é a classe base do FluentValidation
// T = CreateEmpresaCommand (o comando que queremos validar)
//
// Registrado automaticamente em ProjectBootstrapper.cs:
//   services.AddValidatorsFromAssembly(domainAssembly);
// Isso escaneia TODOS os validators do Domain e registra no DI
public sealed class CreateEmpresaCommandValidation : AbstractValidator<CreateEmpresaCommand>
{
    public CreateEmpresaCommandValidation()
    {
        // RuleFor = "defina uma regra para a propriedade X"
        // Cada regra é executada pelo ValidationBehavior antes do handler

        RuleFor(c => c.CNPJ)
            .NotEmpty().WithMessage("CNPJ é obrigatório.")
            .Matches(@"^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$")
            .WithMessage("CNPJ inválido.");

        RuleFor(c => c.RazaoSocial)
            .NotEmpty().WithMessage("Razão Social é obrigatória.")
            .MaximumLength(300);

        RuleFor(c => c.Regime)
            .IsInEnum().WithMessage("Regime tributário inválido.");
    }
}

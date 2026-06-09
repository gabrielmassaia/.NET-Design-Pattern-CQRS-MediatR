---
created: 2026-06
updated: 2026-06
tags: glossary, domain
scope: sh
---

# Domain Glossary

> Centralized terminology for the accessory obligations domain (obrigações acessórias).

---

## Tax Regimes

| Term | Portuguese | Description |
|---|---|---|
| `SimplesNacional` | Simples Nacional | Simplified tax regime for small businesses. Monthly DAS payment. |
| `LucroPresumido` | Lucro Presumido | Presumed profit regime. Requires DCTF, EFD filings. |
| `LucroReal` | Lucro Real | Actual profit regime (large companies, banks). Full obligation set. |
| `ImunidadeIsencao` | Imunidade/Isenção | Tax-exempt entities (NGOs, charities, educational institutions). No obligations generated. |

---

## Obligation Types

| Code | Name | Periodicity | Description |
|---|---|---|---|
| `DAS` | Documento de Arrecadação do Simples Nacional | Monthly | Unified tax payment for Simples Nacional |
| `DCTF` | Declaração de Débitos e Créditos Tributários Federais | Monthly | Federal tax debts/credits declaration |
| `EFD_ICMS_IPI` | Escrituração Fiscal Digital ICMS/IPI | Monthly | Digital fiscal bookkeeping for ICMS/IPI |
| `EFD_Contribuicoes` | Escrituração Fiscal Digital de Contribuições | Monthly | Fiscal bookkeeping for PIS/COFINS contributions |
| `EFD_Reinf` | Escrituração Fiscal Digital de Retenções | Monthly | Digital bookkeeping of withholding taxes |
| `eSocial` | Sistema de Escrituração Digital das Obrigações Trabalhistas | Monthly | Labor obligations digital system |
| `DEFIS` | Declaração de Informações Socioeconômicas e Fiscais | Annual | Socioeconomic and fiscal info (Simples) |
| `SPED_ECD` | Escrituração Contábil Digital | Annual | Digital accounting bookkeeping |
| `SPED_ECF` | Escrituração Contábil Fiscal | Annual | Fiscal accounting bookkeeping |
| `DIRF` | Declaração do Imposto de Renda Retido na Fonte | Annual | Withholding income tax declaration |
| `RAIS` | Relação Anual de Informações Sociais | Annual | Annual social information report |

---

## Status

| Value | Description |
|---|---|
| `Pendente` | Due date not yet reached, no delivery recorded |
| `Atrasada` | Past due date, no delivery recorded |
| `Entregue` | Delivery has been registered |

---

## Architectural Terms

| Term | Description |
|---|---|
| **Clean Architecture** | Layer separation with Domain at center, zero infra dependencies |
| **MediatR** | .NET library implementing the Mediator pattern for CQRS |
| **CQRS** | Command Query Responsibility Segregation |
| **Command** | Immutable data object representing a use case intention |
| **Handler** | Executes the use case logic for a specific Command |
| **Validator** | FluentValidation rule set for a Command |
| **AppService** | Thin facade translating ViewModels to Commands and back |
| **UnitOfWork** | Single transaction/commit point, wrapping EF Core SaveChanges |
| **Repository** | Abstracted data access interface (Domain) and implementation (Data) |
| **ResponseData** | Standard API response envelope with Success, Data, Errors |
| **Notification** | MediatR INotification for side-effect propagation |

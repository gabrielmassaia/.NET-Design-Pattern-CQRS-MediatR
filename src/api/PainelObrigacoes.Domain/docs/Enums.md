# Enums

## Responsabilidade

Define os tipos enumerados compartilhados por todas as camadas do domínio.

## Enums

### RegimeTributario

Identifica o regime fiscal da empresa. Determina quais obrigações são geradas pela TributaryRulesEngine.

```csharp
public enum RegimeTributario
{
    SimplesNacional = 1,   // Gera DAS, eSocial, DEFIS, DIRF, RAIS
    LucroPresumido = 2,    // Gera DCTF, EFDs, eSocial, SPEDs, DIRF, RAIS
    LucroReal = 3,         // Gera DCTF, EFDs, eSocial, SPEDs, DIRF, RAIS
    ImunidadeIsencao = 4   // Não gera obrigações
}
```

### StatusObrigacao

Status atual de uma obrigação, calculado em tempo real pelo handler.

```csharp
public enum StatusObrigacao
{
    Pendente = 1,    // Dentro do prazo
    Entregue = 2,    // DataEntrega preenchida
    Atrasada = 3     // Vencimento passou sem entrega
}
```

### TipoObrigacao

Os 10 tipos de obrigações acessórias suportados:

| Tipo | Descrição | Regime |
|---|---|---|
| DAS | Documento de Arrecadação do Simples Nacional | Simples |
| DCTF | Declaração de Débitos e Créditos Tributários Federais | Lucro Presumido/Real |
| eSocial | Sistema de Escrituração Digital das Obrigações Fiscais | Todos |
| EFD_ICMS_IPI | Escrituração Fiscal Digital ICMS/IPI | Lucro Presumido/Real |
| EFD_Contribuicoes | Escrituração Fiscal Digital de Contribuições | Lucro Presumido/Real |
| EFD_Reinf | Escrituração Fiscal Digital de Retenções | Lucro Presumido/Real |
| SPED_ECD | Escrituração Contábil Digital | Lucro Presumido/Real |
| SPED_ECF | Escrituração Contábil Fiscal | Lucro Presumido/Real |
| DIRF | Declaração do Imposto de Renda Retido na Fonte | Todos (anual) |
| RAIS | Relação Anual de Informações Sociais | Todos (anual) |

## Conexões

- **Domain/Obrigacoes/Services/TributaryRulesEngine** → usa `RegimeTributario` e `TipoObrigacao` para decidir quais obrigações gerar
- **Domain/Obrigacoes/Services/DueDateCalculator** → usa `TipoObrigacao` para calcular a data de vencimento
- **Domain/Obrigacoes/Models** → `ObrigacaoModel` e `ObrigacaoReadModel` usam `StatusObrigacao` e `TipoObrigacao`
- **Domain/Empresas/Models** → `EmpresaModel` usa `RegimeTributario`

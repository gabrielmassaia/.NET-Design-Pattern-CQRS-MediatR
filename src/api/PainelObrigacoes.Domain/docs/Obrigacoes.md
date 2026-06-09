# Obrigações (Domínio)

## Responsabilidade

Contém as regras de negócio para gestão de obrigações fiscais: consulta, registro de entrega, histórico, cálculo de vencimentos e motor de regras tributárias.

## Estrutura

```
Obrigacoes/
├── Commands/
│   └── RegistrarEntregaCommand.cs        # Intenção de marcar como entregue
├── CommandHandlers/
│   └── RegistrarEntregaCommandHandler.cs # Executa o registro
├── Queries/
│   ├── FindObrigacoesQuery.cs            # Listagem com filtros
│   └── GetHistoricoEmpresaQuery.cs       # Histórico de entregues
├── QueryHandlers/
│   ├── FindObrigacoesQueryHandler.cs     # Listagem + cálculo de status
│   └── GetHistoricoEmpresaQueryHandler.cs
├── Models/
│   ├── ObrigacaoModel.cs                 # Modelo de escrita
│   └── ObrigacaoReadModel.cs             # Modelo de leitura
├── Repositories/
│   └── IObrigacaoRepository.cs           # Contrato de persistência
├── Services/
│   ├── ITributaryRulesEngine.cs          # Motor de regras
│   ├── TributaryRulesEngine.cs           # Implementação
│   ├── IDueDateCalculator.cs             # Cálculo de vencimentos
│   ├── DueDateCalculator.cs
│   ├── IBusinessDayAdjuster.cs           # Ajuste de dias úteis
│   ├── BusinessDayAdjuster.cs
│   ├── IHolidayProvider.cs               # Feriados
│   └── BrazilianHolidayProvider.cs
├── Validations/
│   ├── RegistrarEntregaCommandValidation.cs
│   └── FindObrigacoesQueryValidation.cs
└── Events/
    └── ObrigacaoEntregueEvent.cs         # Publicado após entrega
```

## Regras de negócio

### Registro de entrega
- Obrigação deve existir — senão, `KeyNotFoundException`
- Obrigação não pode já estar entregue — senão, `InvalidOperationException`
- Data de entrega padrão é `DateTime.UtcNow` se não informada
- Publica `ObrigacaoEntregueEvent` para invalidação de cache

### Listagem com status
O handler `FindObrigacoesQueryHandler` calcula o status em tempo real:

```
Status = DataEntrega.HasValue ? Entregue
       : DataVencimento < hoje ? Atrasada
       : Pendente
```

Isso garante que obrigações atrasam automaticamente conforme o tempo passa, sem necessidade de job de atualização.

### Motor de regras tributárias

A `TributaryRulesEngine` decide quais obrigações cada empresa precisa com base no regime:

| Regime | Obrigações Mensais | Anuais (Janeiro) |
|---|---|---|
| Simples Nacional | DAS, eSocial | DEFIS, DIRF, RAIS |
| Lucro Presumido | DCTF, EFD_ICMS_IPI, EFD_Contrib, EFD_Reinf, eSocial | SPED_ECD, SPED_ECF, DIRF, RAIS |
| Lucro Real | (mesmo que Lucro Presumido) | (mesmo que Lucro Presumido) |
| Imunidade/Isenção | Nenhuma | Nenhuma |

### Cálculo de vencimentos

Cada tipo de obrigação tem sua regra de vencimento, implementada no `DueDateCalculator`:

| Tipo | Regra | Exemplo (competência jan/2024) |
|---|---|---|
| DAS | Dia 20 do mês seguinte | 20/02/2024 |
| DCTF | Dia 15 do 2º mês seguinte | 15/03/2024 |
| eSocial | Dia 7 do mês seguinte | 07/02/2024 |
| SPED_ECD | 31 de maio do ano seguinte | 31/05/2025 |
| SPED_ECF | 31 de julho do ano seguinte | 31/07/2025 |
| DIRF | 28 de fevereiro do ano seguinte | 28/02/2025 |
| RAIS | 31 de março do ano seguinte | 31/03/2025 |

### Ajuste de dias úteis

O `BusinessDayAdjuster` ajusta vencimentos que caem em:
- Finais de semana → próximo dia útil
- Feriados nacionais → próximo dia útil

O `BrazilianHolidayProvider` fornece:
- Feriados fixos (Natal, Tiradentes, Independência, etc.)
- Feriados móveis calculados pelo algoritmo de Gauss (Carnaval, Páscoa, Corpus Christi)

## Conexões

- **Application/Obrigacoes** → AppServices que enviam os Commands/Queries
- **Infrastructure.Data/Obrigacoes.Repositories** → implementa `IObrigacaoRepository`
- **Infrastructure.Services** → exportação PDF/CSV
- **Redis** → cache invalidado via `ObrigacaoEntregueEvent`

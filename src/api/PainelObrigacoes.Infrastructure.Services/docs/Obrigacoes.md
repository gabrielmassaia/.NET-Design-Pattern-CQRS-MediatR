# Obrigações (Export Service)

## Responsabilidade

Gera relatórios de exportação das obrigações nos formatos PDF e CSV.

## Arquivo

```
Obrigacoes/ObrigacaoExportService.cs
```

Implementa `IObrigacaoExportService` com os métodos:

- `ToPdf(obrigacoes, ano, mes)` → calendário de obrigações em PDF (QuestPDF)
- `ToCsv(obrigacoes, ano, mes)` → calendário de obrigações em CSV

### Proteção contra CSV Injection

Mesma proteção do Dashboard: valores que começam com `=`, `+`, `-`, `@` recebem prefixo `\t`.

## Conexões

- **Application/Obrigacoes/Services/IObrigacaoExportService** → contrato implementado aqui
- **Application/Obrigacoes/ViewModels** → dados de entrada para gerar os relatórios
- **Infrastructure.CrossCutting.IoC/Obrigacoes** → registra o serviço no DI

# CleanArchReference.Infrastructure.Services — Serviços de Exportação

## ⑥ Degrau na escada

```
 ① Api
 ② Application               → fornece ViewModels para exportar
 ③ IoC
 ④ Domain
 ⑤ Data
 ────────────────────────────────────
 ⑥ Infrastructure.Services  ← VOCÊ ESTÁ AQUI  → gera PDF, CSV
 ─────────────────────
 ⑦ Shared
```

## Responsabilidade

Fornece serviços de infraestrutura voltados à **geração de relatórios e exportação**.
Separa a responsabilidade de renderização (PDF, CSV) da persistência (Data) porque são motivos de mudança distintos.

## O que contém

| Pasta | Função |
|---|---|
| `Dashboard/DashboardExportService.cs` | Exporta dashboard e alertas em PDF/CSV |
| `Obrigacoes/ObrigacaoExportService.cs` | Exporta obrigações em PDF/CSV |

## Dependências

- CleanArchReference.Application (precisa dos ViewModels para gerar relatórios)
- Pacotes NuGet: QuestPDF

## Quem depende

- CleanArchReference.Infrastructure.CrossCutting.IoC (registra os serviços)

## Por que existe separado de Infrastructure.Data?

- **Data** lida com banco, consultas, migrações — muda quando o esquema do BD muda
- **Services** lida com renderização de relatórios — muda quando o layout muda
- Se estivessem juntos, uma alteração no layout de PDF forçaria rebuild de todo o Data
- Data depende de Domain; Services depende de Application — são "vizinhos" na arquitetura, não sobrepostos

# Empresas (Domínio)

## Responsabilidade

Contém as regras de negócio para gestão de empresas: criação, listagem, busca e exclusão.

## Estrutura

```
Empresas/
├── Commands/
│   ├── CreateEmpresaCommand.cs     # Intenção de criar empresa
│   └── DeleteEmpresaCommand.cs     # Intenção de deletar empresa
├── CommandHandlers/
│   ├── CreateEmpresaCommandHandler.cs   # Executa a criação
│   └── DeleteEmpresaCommandHandler.cs   # Executa a exclusão
├── Queries/
│   ├── FindEmpresasQuery.cs        # Listagem paginada
│   └── SearchEmpresasQuery.cs      # Busca textual
├── QueryHandlers/
│   ├── FindEmpresasQueryHandler.cs     # Listagem
│   └── SearchEmpresasQueryHandler.cs   # Busca no Meilisearch
├── Models/
│   └── EmpresaModel.cs             # Modelo de domínio
├── Repositories/
│   └── IEmpresaRepository.cs       # Contrato de persistência
├── Services/
│   └── IEmpresaSearchService.cs    # Contrato de busca textual
├── Validations/
│   ├── CreateEmpresaCommandValidation.cs
│   └── FindEmpresasQueryValidation.cs
└── Events/
    ├── EmpresaCreatedEvent.cs      # Publicado após criar
    └── EmpresaDeletedEvent.cs      # Publicado após deletar
```

## Regras de negócio

### Criação
- CNPJ é armazenado sem formatação (apenas dígitos)
- CNPJ duplicado lança `InvalidOperationException`
- Ao criar, gera automaticamente 12 meses de obrigações via `TributaryRulesEngine`
- Publica `EmpresaCreatedEvent` para indexação Meilisearch + invalidação de cache

### Exclusão
- Se empresa não existir, lança `KeyNotFoundException`
- Remove em cascata todas as obrigações
- Publica `EmpresaDeletedEvent` para remoção do Meilisearch + invalidação de cache

### Listagem
- Paginada com parâmetros `Skip`/`Take`
- Default: `Take = 50`

### Busca
- Delega para `IEmpresaSearchService` que indexa no Meilisearch
- Busca nos campos `razaoSocial` e `cnpj`

## Conexões

- **Application/Empresas** → AppServices que enviam os Commands/Queries
- **Infrastructure.Data/Empresas.Repositories** → implementa `IEmpresaRepository`
- **Infrastructure.Data/Search** → implementa `IEmpresaSearchService` via Meilisearch
- **Domain/Obrigacoes** → `CreateEmpresaCommandHandler` depende de `IObrigacaoRepository` e `ITributaryRulesEngine`

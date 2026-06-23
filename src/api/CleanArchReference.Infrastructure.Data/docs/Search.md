# Search (Meilisearch)

## Responsabilidade

Implementa a indexação e busca textual de empresas no Meilisearch.

## Arquivos

```
Search/
├── MeilisearchIndexSetup.cs        # Configuração do índice na inicialização
└── MeilisearchEmpresaService.cs    # Implementação do serviço de busca
```

### MeilisearchIndexSetup

`IHostedService` que executa na inicialização da aplicação. Configura o índice `"empresas"` no Meilisearch:

```csharp
StartAsync()
  → client.Index("empresas")
  → UpdateSearchableAttributes(["razaoSocial", "cnpj"])
  → UpdateFilterableAttributes(["regime"])
```

- **Searchable**: campos que o Meilisearch usa para busca textual com typo-tolerance
- **Filterable**: campos que podem ser usados em filtros (ex: filtrar por regime)

### MeilisearchEmpresaService

Implementa `IEmpresaSearchService` com três operações:

| Operação | Método Meilisearch | Quando |
|---|---|---|
| Indexar | `AddDocumentsAsync` | Após criar empresa |
| Remover | `DeleteOneDocumentAsync` | Após deletar empresa |
| Buscar | `SearchAsync<T>` | Quando usuário pesquisa |

O documento indexado tem a seguinte estrutura:

```json
{
  "id": "guid-string",
  "cnpj": "11222333000181",
  "razaoSocial": "Padaria São João Ltda",
  "regime": 1,
  "createdAt": "2026-06-07T..."
}
```

## Conexões

- **Domain/Empresas/Services/IEmpresaSearchService** → contrato implementado aqui
- **Events/** → handlers de eventos chamam `IndexAsync` e `DeleteFromIndexAsync`
- **Domain/Empresas/QueryHandlers/SearchEmpresasQueryHandler** → chama `SearchAsync` nas buscas
- **Infrastructure.CrossCutting.IoC/ProjectBootstrapper** → registra `MeilisearchClient` e o `IHostedService`
- **Seed/DatabaseSeeder** → indexa empresas seeded no Meilisearch

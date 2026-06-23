# Events (Handlers de Domínio)

## Responsabilidade

Contém os handlers de eventos de domínio (`INotificationHandler<T>`) que executam side effects após as operações de escrita.

## Arquivos

```
Events/
├── EmpresaCreatedHandler.cs       # Indexa no Meilisearch + invalida cache
├── EmpresaDeletedHandler.cs       # Remove do Meilisearch + invalida cache
└── ObrigacaoEntregueHandler.cs    # Invalida cache do dashboard e alertas
```

## Handlers

### EmpresaCreatedHandler

Disparado por `EmpresaCreatedEvent` após criar uma empresa.

```csharp
Handle(EmpresaCreatedEvent)
  → searchService.IndexAsync(empresa)         // Indexa no Meilisearch
  → cache.RemoveAsync("dashboard:{ano}:{mes}") // Invalida dashboard
  → cache.RemoveAsync("alertas:current")        // Invalida alertas
```

### EmpresaDeletedHandler

Disparado por `EmpresaDeletedEvent` após deletar uma empresa.

```csharp
Handle(EmpresaDeletedEvent)
  → searchService.DeleteFromIndexAsync(id)     // Remove do Meilisearch
  → cache.RemoveAsync("dashboard:{ano}:{mes}")
  → cache.RemoveAsync("alertas:current")
```

### ObrigacaoEntregueHandler

Disparado por `ObrigacaoEntregueEvent` após registrar entrega.

```csharp
Handle(ObrigacaoEntregueEvent)
  → cache.RemoveAsync("dashboard:{ano}:{mes}")
  → cache.RemoveAsync("alertas:current")
```

## Por que ficam aqui e não no Domain?

Os handlers precisam de dependências de infraestrutura (`IDistributedCache`, `IEmpresaSearchService`). No Domain não podemos referenciar esses tipos (regra de Clean Architecture). Por isso os handlers de eventos ficam em Infrastructure.Data e são registrados via IoC.

## Conexões

- **Domain/Empresas/Events** → eventos que disparam estes handlers
- **Domain/Obrigacoes/Events** → eventos que disparam estes handlers
- **Search/** → `IEmpresaSearchService` usado para indexar/remover do Meilisearch
- **Redis** → `IDistributedCache` usado para invalidar cache

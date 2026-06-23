# Empresas

## Responsabilidade

Gerencia o cadastro de empresas, incluindo criação, listagem, busca textual e exclusão.

## Estrutura

```
Empresas/
├── Services/
│   ├── IEmpresaAppService.cs      # Contrato
│   └── EmpresaAppService.cs       # Implementação
├── ViewModels/
│   ├── CreateEmpresaViewModel.cs  # DTO de entrada (criação)
│   └── EmpresaResultViewModel.cs  # DTO de saída
└── AutoMapper/
    └── EmpresaProfile.cs          # Mapeamentos
```

## Fluxo

### Criação

```
Endpoint → EmpresaAppService.CreateAsync()
  → mapper: CreateEmpresaViewModel → CreateEmpresaCommand
  → IMediatrService.SendCommand(command)
    → CreateEmpresaCommandHandler
      → valida CNPJ duplicado
      → salva empresa + gera 12 meses de obrigações
      → IUnitOfWork.CompleteAsync()
      → publica EmpresaCreatedEvent (→ Meilisearch + invalida cache)
  → mapper: EmpresaModel → EmpresaResultViewModel
```

### Listagem

```
Endpoint → EmpresaAppService.FindAllAsync()
  → IMediatrService.SendQuery(FindEmpresasQuery)
    → FindEmpresasQueryHandler → IEmpresaRepository.FindAllAsync()
  → mapper: IList<EmpresaModel> → IList<EmpresaResultViewModel>
```

### Busca textual

```
Endpoint → EmpresaAppService.SearchAsync()
  → IMediatrService.SendQuery(SearchEmpresasQuery)
    → SearchEmpresasQueryHandler → IEmpresaSearchService.SearchAsync()
      → Meilisearch (índice "empresas")
```

### Exclusão

```
Endpoint → EmpresaAppService.DeleteAsync()
  → IMediatrService.SendCommand(DeleteEmpresaCommand)
    → DeleteEmpresaCommandHandler
      → remove empresa + obrigações
      → IUnitOfWork.CompleteAsync()
      → publica EmpresaDeletedEvent (→ Meilisearch + invalida cache)
```

## Conexões

- **Domain/Empresas** → Commands, Handlers, Models, Repository interface
- **Domain/Obrigacoes** → CreateEmpresaHandler gera obrigações via TributaryRulesEngine
- **Infrastructure.Data/Search** → indexação no Meilisearch
- **Infrastructure.Data/Empresas.Repositories** → repositório concreto

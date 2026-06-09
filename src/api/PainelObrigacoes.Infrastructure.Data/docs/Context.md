# Context (DbContext + UnitOfWork)

## Responsabilidade

Gerencia a conexão com o banco de dados PostgreSQL via EF Core e centraliza as transações.

## Arquivos

```
Context/
├── AppDbContext.cs    # DbContext do EF Core
└── UnitOfWork.cs      # Implementação do IUnitOfWork
```

### AppDbContext

DbContext principal que mapeia as entidades `EmpresaEntity` e `ObrigacaoEntity` para as tabelas do PostgreSQL.

- Configuração via Fluent API nos arquivos `Configurations/`
- Usa `SplitQuery` para consultas com `Include` para evitar cartesian explosion
- Aplica filtro global `QueryFilter` para soft delete (`IsActive`) na entidade Empresa

### UnitOfWork

Implementa `IUnitOfWork` e delega para `AppDbContext.SaveChangesAsync()`.

```csharp
public async Task CompleteAsync(CancellationToken ct = default)
    => await _context.SaveChangesAsync(ct);
```

Nenhum repositório chama `SaveChanges` diretamente — apenas o `UnitOfWork`.

## Conexões

- **Domain/Shared/Interfaces/IUnitOfWork** → contrato implementado aqui
- **Infrastructure.CrossCutting.IoC/ProjectBootstrapper** → registra `AppDbContext` e `IUnitOfWork`
- **Configurations/** → fluent mappings aplicados no `OnModelCreating`
- **Migrations/** → geradas a partir deste DbContext

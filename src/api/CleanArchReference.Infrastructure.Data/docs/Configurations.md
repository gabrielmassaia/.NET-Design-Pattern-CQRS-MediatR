# Configurations (Fluent API)

## Responsabilidade

Define o mapeamento das entidades para as tabelas do banco usando Fluent API do EF Core.

## Arquivos

```
Configurations/
├── EmpresaConfiguration.cs      # Mapeamento da entidade EmpresaEntity
└── ObrigacaoConfiguration.cs    # Mapeamento da entidade ObrigacaoEntity
```

Each configuration implementa `IEntityTypeConfiguration<T>` e é aplicada automaticamente pelo EF Core via `ApplyConfigurationsFromAssembly`.

## Conexões

- **Entities/** → configura as entidades mapeadas
- **Context/AppDbContext** → `OnModelCreating` aplica as configurações via assembly scan
- **Migrations/** → as migrações refletem estas configurações

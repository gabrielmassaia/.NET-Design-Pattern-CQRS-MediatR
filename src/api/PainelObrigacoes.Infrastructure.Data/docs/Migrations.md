# Migrations

## Responsabilidade

Gerencia as migrações do banco de dados PostgreSQL via EF Core.

## Estrutura

```
Migrations/
├── 20260607032921_InitialCreate.cs
├── 20260607032921_InitialCreate.Designer.cs
└── AppDbContextModelSnapshot.cs
```

## Gerenciamento

As migrações são aplicadas automaticamente na inicialização da aplicação:

```csharp
// Em Program.cs
if (!app.Environment.IsEnvironment("Test"))
    db.Database.Migrate();
```

Para criar uma nova migração:

```bash
dotnet ef migrations add <Nome> \
    --project PainelObrigacoes.Infrastructure.Data \
    --startup-project PainelObrigacoes.Api
```

## Conexões

- **Context/AppDbContext** → modelo que as migrações refletem
- **Configurations/** → fluent mappings que configuram as tabelas
- **Program.cs** → `db.Database.Migrate()` aplica as pendentes na inicialização

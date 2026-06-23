# Entities

## Responsabilidade

Define as classes de mapeamento ORM (Entity Framework Core) que representam as tabelas do banco de dados.

## Arquivos

```
Entities/
├── EntityBase.cs          # Classe base com Id, CreatedAt, UpdatedAt
├── EmpresaEntity.cs       # Mapeamento da tabela Empresas
└── ObrigacaoEntity.cs     # Mapeamento da tabela Obrigacoes
```

### EntityBase

Propriedades comuns a todas as entidades:

```csharp
public abstract class EntityBase
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

O `Id` é gerado automaticamente pelo EF Core (Guid). `CreatedAt` e `UpdatedAt` são preenchidos automaticamente no `SaveChanges` via interceptor ou configuração.

### EmpresaEntity

Mapeamento para a tabela `Empresas`. Contém `IsActive` para soft delete.

### ObrigacaoEntity

Mapeamento para a tabela `Obrigacoes`. Contém `RowVersion` (concurrency token) para controle de concorrência no registro de entrega.

## Separação Entity vs Model

As Entities são classes de infraestrutura, diferentes dos Models de domínio:

- **Entity** → mapeamento ORM, propriedades de banco, concurrency tokens
- **Model** → modelo de domínio puro, sem dependência de infraestrutura

A conversão entre ambos é feita internamente nos repositórios.

## Conexões

- **Context/AppDbContext** → registra as entidades como DbSets
- **Configurations/** → fluent mappings que configuram o mapeamento de cada entidade

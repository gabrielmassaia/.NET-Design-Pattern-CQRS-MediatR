# Repositories

## Responsabilidade

Implementa os contratos de repositório definidos no Domain, fazendo a ponte entre os modelos de domínio e o banco de dados via EF Core.

## Estrutura

```
Empresas/Repositories/
└── EmpresaRepository.cs      # Implementação de IEmpresaRepository

Obrigacoes/Repositories/
└── ObrigacaoRepository.cs    # Implementação de IObrigacaoRepository
```

## Padrão

Cada repositório:

1. Recebe `AppDbContext` por injeção
2. Implementa a interface definida no Domain
3. Converte entre `Entity` (ORM) e `Model` (domínio) internamente
4. Usa `AsNoTracking()` para consultas de leitura
5. **Nunca chama `SaveChanges`** — o commit é responsabilidade do `IUnitOfWork`

```csharp
public async Task<IList<EmpresaModel>> FindAllAsync(int skip, int take)
{
    var entities = await _context.Empresas.AsNoTracking()
        .Skip(skip).Take(take)
        .ToListAsync();

    return entities.Select(ToModel).ToList();
}

public void Create(EmpresaModel model)
    => _context.Empresas.Add(ToEntity(model));
```

## Consultas do ObrigacaoRepository

Além das operações CRUD padrão, contém consultas específicas para o dashboard:

| Método | Retorna | Usado por |
|---|---|---|
| `GetDashboardCountsAsync(ano, mes)` | `DashboardModel` com totais agregados | `GetDashboardQueryHandler` |
| `FindAlertasAsync(dataLimite, limite)` | `List<AlertaModel>` das obrigações urgentes | `GetAlertasQueryHandler` |
| `FindByEmpresaAndMonthAsync(...)` | `List<ObrigacaoReadModel>` do calendário | `FindObrigacoesQueryHandler` |
| `FindEntreguesByEmpresaAsync(id)` | `List<ObrigacaoReadModel>` do histórico | `GetHistoricoEmpresaQueryHandler` |

## Conexões

- **Domain/Empresas/Repositories** → `IEmpresaRepository` (contrato)
- **Domain/Obrigacoes/Repositories** → `IObrigacaoRepository` (contrato)
- **Context/AppDbContext** → DbContext injetado nos repositórios
- **Context/UnitOfWork** → centraliza o `SaveChanges`

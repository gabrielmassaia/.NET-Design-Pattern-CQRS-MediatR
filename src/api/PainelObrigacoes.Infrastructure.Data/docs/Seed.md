# Seed (Database Seeder)

## Responsabilidade

Popula o banco de dados com dados de demonstração para desenvolvimento.

## Arquivo

```
Seed/DatabaseSeeder.cs
```

## Funcionamento

O seeder é executado na inicialização da aplicação (em `Program.cs`), apenas em ambientes que não são "Test". Verifica se já existem empresas cadastradas antes de semear.

### Dados gerados

4 empresas, uma de cada regime tributário:

| CNPJ | Nome | Regime |
|---|---|---|
| 11222333000181 | Padaria São João Ltda | Simples Nacional |
| 22333444000172 | Consultoria Fiscal Omega S.A. | Lucro Presumido |
| 33444555000163 | Banco Meridional S.A. | Lucro Real |
| 44555666000154 | Instituto Educar Brasil | Imunidade/Isenção |

Para cada empresa:

1. Cria a entidade no banco
2. Indexa no Meilisearch
3. Gera 12 meses de obrigações via `TributaryRulesEngine`
4. Marca 3 obrigações já vencidas como "entregues" (demonstração de histórico)

## Conexões

- **Infrastructure.CrossCutting.IoC** → seeder é chamado pelo `Program.cs`
- **Domain/Obrigacoes/Services/TributaryRulesEngine** → gera as obrigações
- **Data/Search/MeilisearchEmpresaService** → indexa empresas criadas

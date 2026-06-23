# 📘 Fluxo Completo: Criar Empresa

> **Objetivo:** Rastrear cada linha de código desde o clique no frontend até o INSERT no PostgreSQL
> **Stack:** .NET 9, MediatR 12, EF Core 9, Clean Architecture, CQRS

---

## 🗺️ Mapa da Jornada

```
🌐 Frontend React
    │
    ▼ POST /api/empresas
┌──────────────────────────────────────────────────────────────┐
│ 🔵 FASE 1 — Api Layer (Endpoint)                            │
│    "Portão de entrada: recebe HTTP, NÃO tem regra de negócio"│
│    Arquivo: EmpresasEndpoints.cs                             │
├──────────────────────────────────────────────────────────────┤
│ 🟢 FASE 2 — Application Layer (AppService)                  │
│    "Tradutor: converte ViewModel ↔ Command ↔ ViewModel"      │
│    Arquivo: EmpresaAppService.cs                             │
├──────────────────────────────────────────────────────────────┤
│ 🟡 FASE 3 — Domain Layer (MediatR Pipeline)                  │
│    3.1 MediatrService: ponte Application → MediatR           │
│    3.2 ValidationBehavior: valida campos (FluentValidation)  │
│    3.3 CommandHandler: REGRA DE NEGÓCIO (coração)            │
│    3.4 Domain Event: side effects (indexar, limpar cache)    │
├──────────────────────────────────────────────────────────────┤
│ 🟠 FASE 4 — Infrastructure.Data Layer                        │
│    4.1 Repository: traduz Model ↔ Entity, rastreia mudanças  │
│    4.2 UnitOfWork: commit único (SaveChanges)                │
│    4.3 Event Handler: indexa Meilisearch + invalida cache    │
├──────────────────────────────────────────────────────────────┤
│ 🔴 FASE 5 — Resposta                                         │
│    5.1 AutoMapper: EmpresaModel → EmpresaResultViewModel     │
│    5.2 ResponseData envelopeia resultado                      │
│    5.3 ExceptionMiddleware captura erros (se houver)         │
└──────────────────────────────────────────────────────────────┘
    │
    ▼ 200 OK { success: true, data: { id, cnpj, ... } }
🌐 Frontend React
```

---

## 🔵 FASE 1 — Api Layer (Endpoint)

### Arquivo: `Api/Endpoints/EmpresasEndpoints.cs`

```
Responsabilidade: "Portão de entrada da API"
O que faz:       Recebe HTTP, chama AppService, envelopa resposta
Regra de ouro:   ❌ NUNCA ter regra de negócio
                 ❌ NUNCA ter try/catch
                 ✅ Só chamar o AppService e retornar
```

**Fluxo detalhado:**

```
HTTP POST /api/empresas
Body: { "cnpj": "11.222.333/0001-81", "razaoSocial": "Padaria São João", "regime": 0 }
    │
    │  O ASP.NET faz 3 coisas automaticamente:
    │    1️⃣ Lê o JSON do body
    │    2️⃣ Cria um objeto CreateEmpresaViewModel com os dados
    │    3️⃣ Injeta IEmpresaAppService pelo DI
    │
    ▼
appService.CreateAsync(payload, ct)   ← chama o tradutor (FASE 2)
    │
    ▼
result.ToOkResponse()                 ← envelopa em { success: true, data: ... }
    │
    ▼
200 OK ResponseData<EmpresaResultViewModel>
```

---

## 🟢 FASE 2 — Application Layer (AppService)

### Arquivo: `Application/Empresas/Services/EmpresaAppService.cs`

```
Responsabilidade: "Tradutor entre as camadas"
O que faz:       ViewModel → Command → (MediatR) → Model → ResultViewModel
Regra de ouro:   ✅ Só orquestra, não tem regra de negócio
                 ❌ NUNCA chama Repository direto
                 ❌ NUNCA tem if/else de negócio
```

**Fluxo detalhado:**

```
CreateEmpresaViewModel (chegou do HTTP)
    │
    │  PASSO 1: AutoMapper copia campos
    │  CreateEmpresaViewModel → CreateEmpresaCommand
    │  (Application)           (Domain)
    │
    ▼
_mediator.SendCommand(command, ct)
    │
    │  PASSO 2: Envia o Command pelo MediatR
    │  O MediatR processa: Validation → Handler → Repository → Banco
    │  (FASE 3 inteira)
    │
    ▼
EmpresaModel (voltou do handler com Id e CreatedAt)
    │
    │  PASSO 3: AutoMapper copia campos
    │  EmpresaModel → EmpresaResultViewModel
    │  (Domain)       (Application)
    │
    ▼
Retorna pro endpoint
```

### Interface do AppService

### Arquivo: `Application/Empresas/Services/IEmpresaAppService.cs`

```
Por que existe interface?
    - DIP (Dependency Inversion Principle): o endpoint depende da abstração
    - Facilita testes: podemos mockar o AppService
    - Desacopla: se mudar a implementação, endpoint não quebra
```

---

## 🟡 FASE 3 — Domain Layer (MediatR Pipeline)

### 3.0 Os Blocos de Construção

### Arquivo: `Domain/Shared/Commands/Command.cs`

```csharp
public abstract class Command<TResult> : IRequest<TResult> { }
```

```
Command<TResult>:
    - Representa uma "intenção de escrita" (Create, Update, Delete)
    - IRequest<TResult> é a interface do MediatR que diz:
      "isso pode ser processado e retorna algo do tipo TResult"
    - Herda de IRequest para o MediatR conseguir rotear pro handler certo
```

### Arquivo: `Domain/Shared/Queries/Query.cs`

```csharp
public abstract class Query<TResult> : IRequest<TResult> { }
```

```
Query<TResult>:
    - Representa uma "consulta" (leitura de dados)
    - Mesma ideia do Command, mas semanticamente diferente
    - CQRS: Commands escrevem, Queries leem — NUNCA misturar
```

### 3.1 MediatrService — Ponte Application → Domain

### Arquivo: `Infrastructure.CrossCutting.IoC/MediatrService.cs`

```
Responsabilidade: "Despachante do MediatR"
Por que existe?:  O Domain não pode referenciar o MediatR (Clean Architecture)
                  Então a INTERFACE fica no Domain, a implementação fica no IoC
```

**Cadeia de chamadas:**

```
AppService (Application)
    → IMediatrService.SendCommand(command)     ← interface no Domain
        → MediatrService.SendCommand(command)  ← implementação no IoC
            → IMediator.Send(command)          ← MediatR raiz (biblioteca externa)
```

### 3.2 ValidationBehavior — Pipeline do MediatR

### Arquivo: `Domain/Shared/Behaviors/ValidationBehavior.cs`

```
Responsabilidade: "Fiscal de carteirinha"
Quando roda:     ANTES do handler, em TODO Command e Query
O que faz:       Executa FluentValidation automaticamente
```

**Fluxo:**

```
MediatR recebe o Command
    │
    ▼
ValidationBehavior<CreateEmpresaCommand, EmpresaModel>
    │
    │  O DI encontra todos os IValidator<CreateEmpresaCommand>
    │  Neste caso: CreateEmpresaCommandValidation
    │
    ▼
Roda ValidateAsync() em paralelo
    │
    ├── Se algum campo é inválido → throw ValidationException
    │       ↓
    │   ExceptionMiddleware captura → retorna 400 BadRequest
    │
    └── Se tudo OK → chama next() → vai pro Handler
```

### 3.3 Command — O Pedido

### Arquivo: `Domain/Empresas/Commands/CreateEmpresaCommand.cs`

```
Responsabilidade: "Dados da intenção de criar empresa"
O que contém:    Só os dados necessários + método de conversão
O que NÃO tem:   Lógica de negócio, acesso a banco, validação complexa
```

**Por que separar Command de ViewModel?**

| ViewModel (Application) | Command (Domain) |
|------------------------|-------------------|
| Pode ter CNPJ formatado "11.222.333/0001-81" | Deve ter CNPJ limpo "11222333000181" |
| Pode ter campos de UI que não são do domínio | Só campos de negócio |
| Vive na camada de Application | Vive na camada de Domain |

### 3.4 CommandHandler — O Coração do Sistema

### Arquivo: `Domain/Empresas/CommandHandlers/CreateEmpresaCommandHandler.cs`

```
Responsabilidade: ✅ REGRA DE NEGÓCIO PURA
                 ✅ Toda lógica importante fica AQUI
```

**O Handler faz 7 passos:**

```
1. Validação de NEGÓCIO (ausência de CNPJ duplicado)
   └── diferente da validação de CAMPOS (formato) que vai no Validator
   └── se falhar → InvalidOperationException → 409 Conflict

2. Cria o Model de domínio: command.ToModel()
   └── limpa CNPJ, trim na razão social

3. Persiste no repositório (ChangeTracker, sem banco ainda)
   └── _empresaRepository.Create(model)

4. Gera obrigações fiscais baseado no regime tributário
   └── _rulesEngine.GenerateObrigacoes(model, ano, mes)

5. Persiste obrigações no repositório
   └── _obrigacaoRepository.CreateRange(obrigacoes)

6. COMMIT ÚNICO: _unitOfWork.CompleteAsync()
   └── SÓ AQUI chama SaveChanges
   └── TUDO ou NADA: se falha, nada persiste

7. Publica Domain Event (side effects)
   └── EmpresaCreatedEvent → indexa Meilisearch + limpa cache
   └── NÃO bloqueia a resposta (eventual consistency)
```

#### Arquivo: `Domain/Empresas/Events/EmpresaCreatedEvent.cs`

```
INotification: interface do MediatR para "eventos"
Diferente de Command/Query:
    - Command: "FAÇA ISSO" (tem retorno)
    - Event: "ISSO ACONTECEU" (não tem retorno, é fogo e esqueça)
```

#### Arquivo: `Domain/Empresas/Repositories/IEmpresaRepository.cs`

```
Interface do Repository:
    - Definida no Domain: NÃO depende de EF Core
    - Implementada no Infrastructure.Data: USA EF Core
    - Isso é o DIP (Dependency Inversion Principle)
```

### 3.5 DI — Como tudo é conectado

### Arquivo: `Infrastructure.CrossCutting.IoC/ProjectBootstrapper.cs`

```
"Composition Root": ONDE tudo é registrado no DI

Registra:
    - DbContext (PostgreSQL)
    - Redis (cache)
    - Meilisearch (busca)
    - MediatR + Behaviors (ValidationBehavior)
    - FluentValidation (todos os validators do Domain)
    - AutoMapper (todos os profiles do Application)
```

### Arquivo: `Infrastructure.CrossCutting.IoC/Empresas/EmpresaSetup.cs`

```
Registra especificamente as dependências da feature Empresa:
    - IEmpresaAppService → EmpresaAppService (Scoped)
    - IEmpresaRepository → EmpresaRepository (Scoped)
    - IEmpresaSearchService → MeilisearchEmpresaService (Scoped)
    - Event Handlers (EmpresaCreatedHandler, EmpresaDeletedHandler)
```

---

## 🟠 FASE 4 — Infrastructure.Data Layer

### 4.1 Repository — Tradutor entre Domain e EF Core

### Arquivo: `Infrastructure.Data/Empresas/Repositories/EmpresaRepository.cs`

```
Responsabilidade: 
    - Traduzir Model (Domain) ↔ Entity (Infrastructure)
    - Usar EF Core pra ler/escrever no banco
Regra de ouro:
    - ❌ NUNCA chama SaveChanges
    - ✅ Só rastreia mudanças no ChangeTracker do EF
```

**Mapeamento:**

```
┌──────────────┐     ToEntity()     ┌──────────────┐
│ EmpresaModel │ ──────────────────>│ EmpresaEntity │
│   (Domain)   │                    │  (Infra)      │
│              │ <──────────────────│               │
└──────────────┘     ToModel()      └──────────────┘
    │                                    │
    │                                    │
    ▼ EF Core                            ▼
┌──────────────────────────────────────────┐
│          AppDbContext                      │
│   DbSet<EmpresaEntity> Empresas           │
└──────────────────────────────────────────┘
```

### 4.2 UnitOfWork — O Confirmador

### Arquivo: `Infrastructure.Data/Context/UnitOfWork.cs`

```
Responsabilidade: 
    - ÚNICO lugar que chama SaveChanges em TODO o sistema
    - Garante atomicidade: várias ops numa transação só
```

**Por que separado do Repository?**

```
SEM UnitOfWork:
    empresaRepository.Create(model) → SaveChanges aqui
    obrigacaoRepository.CreateRange(list) → SaveChanges aqui
    Se o segundo falhar → empresa já foi salva → dados inconsistentes 😱

COM UnitOfWork:
    empresaRepository.Create(model)   ← só rastreia
    obrigacaoRepository.CreateRange() ← só rastreia
    unitOfWork.CompleteAsync()        ← UM SaveChanges pra TUDO
    Se algo falhar → nada é salvo → dados consistentes ✅
```

### 4.3 Event Handler — Side Effects

### Arquivo: `Infrastructure.Data/Events/EmpresaCreatedHandler.cs`

```
O que acontece DEPOIS da empresa ser criada:
    1. Indexa no Meilisearch (busca full-text com typo tolerance)
    2. Invalida cache do Redis (dashboard e alertas)

Por que em evento separado?
    - O handler principal não precisa esperar indexação
    - Se o Meilisearch estiver offline, a empresa ainda é criada
    - Separa a responsabilidade: handler cria, evento indexa
```

### 4.4 Entity — O Objeto do Banco

### Arquivo: `Infrastructure.Data/Entities/EmpresaEntity.cs`

```
EntityBase:
    Id: Guid (gerado automaticamente)
    CreatedAt: DateTime (UTC)
    UpdatedAt: DateTime? (nulo até ser atualizado)
    IsActive: bool (soft delete — true por padrão)

EmpresaEntity:
    CNPJ: string(14) — índice único no banco
    RazaoSocial: string(300)
    Regime: enum
    Obrigacoes: navigation property (1:N)
```

### Arquivo: `Infrastructure.Data/Configurations/EmpresaConfiguration.cs`

```
Fluent API do EF Core:
    - ToTable("Empresas"): nome da tabela
    - HasKey(e => e.Id): chave primária
    - HasIndex(e => e.CNPJ).IsUnique(): índice único
    - HasQueryFilter(e => e.IsActive): soft delete automático
    - HasMany(e => e.Obrigacoes): relacionamento 1:N com cascade delete
```

---

## 🔴 FASE 5 — Resposta

### 5.1 AutoMapper — Tradutor Automático

### Arquivo: `Application/Empresas/AutoMapper/EmpresaProfile.cs`

```
Duas regras de tradução:
    1. CreateEmpresaViewModel → CreateEmpresaCommand
       (o que chega do HTTP vira o que o Domain entende)

    2. EmpresaModel → EmpresaResultViewModel
       (o que o Domain retorna vira o que o HTTP devolve)
```

### 5.2 ResponseData — Envelope Padrão

### Arquivo: `Shared/ResponseData/ResponseData.cs`

```
Formato de TODAS as respostas da API:
{
  "success": true,
  "message": "",
  "data": { ... },       // o resultado real
  "errorCode": null       // código do erro (se houver)
}

Vantagens:
    - Frontend sempre sabe o formato
    - Tratamento de erro padronizado
    - Metadata sem poluir o data
```

### 5.3 ExceptionMiddleware — O Paraquedas

### Arquivo: `Api/Middleware/ExceptionMiddleware.cs`

```
Captura QUALQUER exceção que escapar dos handlers

ValidationException      → 400 BadRequest   (ErrorCode.Validation)
InvalidOperationException → 409 Conflict     (ErrorCode.Conflict)
KeyNotFoundException     → 404 Not Found    (ErrorCode.NotFound)
Exception                → 500 Server Error (ErrorCode.InternalError)

Benefícios:
    - Nenhum endpoint precisa de try/catch
    - Erro de produção é genérico (não vaza info)
    - Erro de dev é detalhado (debug mais fácil)
```

### 5.4 ResultExtensions — Helper do Endpoint

### Arquivo: `Api/Extensions/ResultExtensions.cs`

```
ToOkResponse(): empacota qualquer dado em ResponseData.Ok()
    → Results.Ok(ResponseData<T>.Ok(data))

Isso é chamado no endpoint:
    return result.ToOkResponse();
    // vira: Results.Ok({ success: true, data: result })
```

---

## 🎯 Resumo Visual: A Viagem Completa

```
HTTP POST /api/empresas {"cnpj":"11.222.333/0001-81", ...}
    │
    ▼
┌──────────────────────────────────────────────────────────────────┐
│ 🔵 FASE 1: Endpoint (Api)                                       │
│    CreateEmpresaAsync(payload, appService, ct)                   │
│    → appService.CreateAsync(payload, ct)                         │
│    → result.ToOkResponse()                                       │
├──────────────────────────────────────────────────────────────────┤
│ 🟢 FASE 2: AppService (Application)                             │
│    AutoMapper: CreateEmpresaViewModel → CreateEmpresaCommand     │
│    _mediator.SendCommand(command)                                │
├──────────────────────────────────────────────────────────────────┤
│ 🟡 FASE 3: Domain Pipeline                                       │
│                                                                   │
│    3.1 MediatrService: SendCommand → IMediator.Send              │
│                                                                   │
│    3.2 ValidationBehavior                                         │
│        ├── CNPJ vazio? → throw ValidationException → 400         │
│        ├── Formato CNPJ inválido? → throw ValidationException    │
│        ├── RazãoSocial vazia? → throw ValidationException        │
│        └── Tudo OK → next()                                      │
│                                                                   │
│    3.3 CreateEmpresaCommandHandler                                │
│        ├── 1. Verifica CNPJ duplicado (banco)                    │
│        │     → se existe: throw InvalidOperationException → 409  │
│        ├── 2. command.ToModel()                                  │
│        ├── 3. _empresaRepository.Create(model)                   │
│        ├── 4. _rulesEngine.GenerateObrigacoes()                  │
│        ├── 5. _obrigacaoRepository.CreateRange()                 │
│        ├── 6. _unitOfWork.CompleteAsync() → SAVECHANGES          │
│        └── 7. _mediator.Publish(EmpresaCreatedEvent)             │
│                                                                   │
│    3.4 Domain Event (side effect, não bloqueia)                  │
│        └── EmpresaCreatedHandler                                 │
│            ├── Indexa no Meilisearch                             │
│            └── Invalida cache Redis                              │
├──────────────────────────────────────────────────────────────────┤
│ 🟠 FASE 4: Infrastructure.Data                                   │
│    EmpresaRepository: Model → Entity → DbSet.Add                 │
│    UnitOfWork: SaveChangesAsync (transação única)                │
├──────────────────────────────────────────────────────────────────┤
│ 🔴 FASE 5: Resposta                                              │
│    AutoMapper: EmpresaModel → EmpresaResultViewModel             │
│    ToOkResponse: → ResponseData<EmpresaResultViewModel>          │
│    → 200 OK { success: true, data: { id, cnpj, ... } }          │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📋 Checklist de Leitura

Para estudar, leia os arquivos nesta ordem:

```
 1.  Api/Program.cs                          ← "ponto de partida"
 2.  Api/Endpoints/EmpresasEndpoints.cs       ← "entrada HTTP"
 3.  Application/Empresas/ViewModels/         ← "contratos"

 4.  Application/Empresas/Services/           ← "tradutor"
 5.  Application/Empresas/AutoMapper/         ← "mapeamento"

 6.  Domain/Shared/Commands/Command.cs        ← "base do CQRS"
 7.  Domain/Shared/Queries/Query.cs            ← "base do CQRS"
 8.  Domain/Shared/Behaviors/                 ← "pipeline validação"
 9.  Domain/Shared/Interfaces/                ← "contratos do Domain"

10.  Domain/Empresas/Commands/                ← "pedido de criação"
11.  Domain/Empresas/CommandHandlers/         ← "REGRA DE NEGÓCIO"
12.  Domain/Empresas/Validations/             ← "validação de campos"
13.  Domain/Empresas/Events/                  ← "eventos de domínio"
14.  Domain/Empresas/Repositories/            ← "interfaces"
15.  Domain/Empresas/Models/                  ← "entidades de domínio"

16.  Infrastructure.Data/Entities/            ← "entidades EF"
17.  Infrastructure.Data/Configurations/      ← "mapeamento tabelas"
18.  Infrastructure.Data/Empresas/Repositories/ ← "implementação EF"
19.  Infrastructure.Data/Context/             ← "DbContext + UoW"
20.  Infrastructure.Data/Events/              ← "handlers de eventos"

21.  Infrastructure.CrossCutting.IoC/         ← "DI composition root"
22.  Shared/ResponseData/                     ← "envelope resposta"
23.  Api/Middleware/                          ← "exception handler"
24.  Api/Extensions/                          ← "helpers"
```

---

## ❓ Perguntas para Fixar

1. **Por que o AppService não chama o Repository direto?**
   > Porque ele não tem regra de negócio. O AppService só traduz dados. Quem tem regra de negócio é o Handler.

2. **Por que ValidationBehavior existe separado do Handler?**
   > Para separar validação de CAMPO (formato CNPJ, obrigatoriedade) de validação de NEGÓCIO (CNPJ duplicado). O primeiro é cross-cutting, o segundo é específico do fluxo.

3. **Por que o Repository nunca chama SaveChanges?**
   > Para garantir atomicidade. Se várias operações precisam ser salvas juntas (empresa + obrigações), o UnitOfWork faz um único SaveChanges. Se o repositório salvasse separado, poderia ficar dados inconsistentes.

4. **O que acontece se o Meilisearch estiver offline na hora de criar empresa?**
   > A empresa é criada normalmente. O Event Handler (EmpresaCreatedHandler) é um side effect — se falhar, não afeta a operação principal. A indexação fica pendente.

5. **Por que Command e ViewModel são objetos diferentes se têm os mesmos campos?**
   > Porque estão em camadas diferentes. A ViewModel (Application) pode ter formatação pra UI. O Command (Domain) tem comportamento de negócio (ToModel()). Misturar viola a Clean Architecture.

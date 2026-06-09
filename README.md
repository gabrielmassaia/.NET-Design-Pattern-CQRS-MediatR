# Painel de Obrigações Acessórias — e-Auditoria

> **Case técnico**
> Sistema para controle centralizado de obrigações fiscais acessórias

---

## 1. O Problema

Escritórios contábeis gerenciam dezenas de CNPJs com regimes tributários distintos. Cada regime (Simples Nacional, Lucro Presumido, Lucro Real) exige um conjunto diferente de obrigações acessórias — DAS, DCTF, EFD, eSocial, SPED, DIRF, RAIS — cada uma com sua própria regra de vencimento. Perder um prazo significa multa.

A maioria ainda gerencia isso em planilhas.

Este sistema resolve esse problema: centraliza o cadastro de empresas, gera automaticamente as obrigações de acordo com as regras de cada regime, calcula vencimentos, controla entregas e alerta sobre prazos próximos ou vencidos.

---

## 2. Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| **Gestão de Empresas** | Cadastro com CNPJ, razão social e regime tributário. Busca textual com Meilisearch. |
| **Geração Automática de Obrigações** | Ao cadastrar uma empresa, 12 meses de obrigações são gerados automaticamente conforme as regras do regime. |
| **Calendário de Obrigações** | Visualização mensal por empresa com status (Pendente / Atrasada / Entregue) e filtros. |
| **Registro de Entregas** | Marcar obrigações como entregues com data de conclusão. |
| **Dashboard** | Totais consolidados: empresas, obrigações do mês, pendentes, entregues, atrasadas. |
| **Painel de Alertas** | Obrigações vencendo em até 30 dias ou já atrasadas, ordenadas por urgência. |
| **Cache** | Dashboard e alertas cacheados em Redis com TTL de 30s/60s. |
| **Busca Textual** | Empresas indexadas no Meilisearch com busca typo-tolerant e debounce de 300ms no frontend. |

---

## 3. Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Backend** | .NET 9, ASP.NET Core, EF Core 9, Npgsql |
| **CQRS / Validação** | MediatR 12, FluentValidation 11, AutoMapper 13 |
| **Banco de Dados** | PostgreSQL 16 |
| **Cache** | Redis 7 (StackExchange.Redis) |
| **Busca** | Meilisearch 1.9 |
| **Frontend** | React 19, Vite 6, TypeScript 5 |
| **UI** | Ant Design 5, TanStack Query 5, Axios, Dayjs |
| **Infraestrutura** | Docker Compose, Nginx |
| **Testes** | xUnit, Moq, FluentAssertions |

---

## 4. Como Rodar

```bash
# Subir toda a stack (5 containers)
docker compose up --build -d
```

Stack pronta em ~30 segundos. Dados de demonstração populados automaticamente.

### Acessar

| URL | O quê |
|---|---|
| http://localhost:3000 | Frontend (React SPA) |
| http://localhost:8080/swagger | API (Swagger UI) |
| http://localhost:7700 | Meilisearch admin |

### Script auxiliar (recomendado)

```bash
# Sobe, aguarda health checks e exibe URLs
./start.ps1

# Com logs em tempo real
./start.ps1 -Logs

# Sem rebuild
./start.ps1 -NoBuild
```

Dados de demonstração: 4 empresas (uma de cada regime tributário) com 12 meses de obrigações geradas para o ano corrente.

### Serviços

| Serviço | Porta | Imagem |
|---|---|---|
| `db` | 5432 | postgres:16-alpine |
| `redis` | 6379 | redis:7-alpine |
| `meilisearch` | 7700 | getmeili/meilisearch:v1.9 |
| `api` | 8080 | custom (.NET 9) |
| `web` | 3000:80 | custom (Nginx + React SPA) |

---

## 5. Arquitetura

### Visão Geral

```
Endpoint → AppService → IMediatrService → ValidationBehavior → CommandHandler → Repository → IUnitOfWork
```

### Clean Architecture em 6 Projetos

```
Api → Application → Domain
Api → IoC → Infrastructure.Data → Domain
```

O **Domain** é o centro — zero dependências de infraestrutura, banco ou HTTP.

| Projeto | Responsabilidade |
|---|---|
| `Domain` | Commands, Handlers, Validators, Models, Repository interfaces, Domain Events |
| `Application` | ViewModels, AppServices (fachadas finas), AutoMapper Profiles |
| `Infrastructure.Data` | EF Core DbContext, Repositories concretos, Migrations, Seed |
| `Infrastructure.CrossCutting.IoC` | DI composition root (ProjectBootstrapper + Feature Setups) |
| `Api` | Endpoints (Minimal API), Middleware, Program.cs |
| `Shared` | ResponseData envelope, ResponseErrorCode |

### Frontend

```
Page → Hook (TanStack Query) → Service → api/axios → .NET API
```

Cada camada tem responsabilidade única. Pages nunca chamam axios diretamente. Hooks abstraem queries e mutations. Services encapsulam chamadas HTTP.

**Organização por domínio:**
```
src/web/src/
├── domain/types/              # Tipos de domínio (empresa, obrigacao, dashboard)
├── application/services/      # Serviços como classes (BaseService + singleton)
├── shared/                    # Código compartilhado (BaseService, ApiResponse, utils)
├── infrastructure/http/       # Axios configurado com interceptors
├── components/ui/             # Componentes reutilizáveis (DataTable, FilterBar, badges)
├── components/dashboard/      # Sub-componentes extraídos (DonutChart, KpiGrid, etc.)
├── hooks/                     # Custom hooks com query keys centralizadas
└── lib/                       # Query keys factory e utilitários
```

Refatorado seguindo o padrão do **Juriflux (menu-starter-web)**: `BaseService<TEntity, TCreate, TUpdate>`,
classes com singleton exportado, barrel exports, path aliases `@/` e React Router DOM para navegação.

---

## 6. Análise de Cenário: Over-engineering vs Pragmatismo

> **Contexto:** Este é um case técnico para demonstrar domínio de ferramentas e padrões de mercado.
> Para um cenário real de pequeno porte (~40 CNPJs), várias decisões seriam diferentes.
> Abaixo, cada escolha é discutida com seu custo-benefício.

### 6.1. Minimal APIs vs Controllers

**O case exige Minimal APIs (.NET 9). O projeto foi implementado com Minimal APIs.**

A escolha por Minimal APIs neste projeto mantém a entrada HTTP enxuta — cada endpoint é uma função
estática dentro de um grupo organizado por feature (`EmpresasEndpoints`, `ObrigacoesEndpoints`, `DashboardEndpoints`).
Toda complexidade permanece nas camadas Application e Domain.

```
Endpoint → AppService → IMediatrService → ValidationBehavior → CommandHandler → Repository → IUnitOfWork
```

Se o projeto fosse implementado com **Controllers**, a diferença seria apenas na camada de entrada:

```
Controller → AppService → IMediatrService → ValidationBehavior → CommandHandler → Repository → IUnitOfWork
```

Ambos os formatos funcionam com a mesma arquitetura de camadas. Controllers oferecem:

- Acoplamento mais explícito com o `IActionResult` e filtros como `ResponseDataFilter`
- Atributos declarativos (`[Route]`, `[FromQuery]`, `[Authorize]`)
- Herança de `BaseController` para centralizar lógica de resposta (ex: `ToActionResult(ResponseData<T>)`)
- Validação automática via `[ApiController]` para ModelState

Já as Minimal APIs exigem:

- Encapsulamento manual do retorno via `ResultExtensions.ToOkResponse<T>()`
- Validação explícita de parâmetros (não há `[Range]` automático como em Controllers)
- Swagger metadata adicionado via fluent chain (`.Produces<T>()`, `.WithTags()`)
- Rate Limiting via `.RequireRateLimiting()` no grupo de endpoints

Para este case, optei por **Minimal APIs** conforme requisito, mas a estrutura de pastas
(`Endpoints/` + `Extensions/`) mantém a organização tão limpa quanto Controllers.

### 6.2. 7 Projetos vs Monolito

**7 projetos para ~4 endpoints parece over-engineering.**

A separação em 7 projetos segue Clean Architecture estrita:

| Projeto | Função | Tamanho |
|---|---|---|
| `Domain` | Regras de negócio puras (zero dependências) | ~20 classes |
| `Application` | Fachadas, ViewModels, AutoMapper | ~15 classes |
| `Infrastructure.Data` | EF Core, Migrations, Repositories | ~12 classes |
| `Infrastructure.CrossCutting.IoC` | Composition Root (DI) | ~6 classes |
| `Infrastructure.Services` | Exportação (PDF/CSV) | ~2 classes |
| `Api` | Endpoints (Minimal API), Middleware | ~8 classes |
| `Shared` | ResponseData envelope | ~2 classes |

Para uma solução real enxuta, `Application` e `Domain` poderiam ser unificados em um projeto `Core`,
reduzindo para 5 projetos. A separação atual visa demonstrar domínio de **SRP (Single Responsibility Principle)**
e organização em camadas — um diferencial em entrevistas para posições de arquitetura.

### 6.3. Meilisearch vs ILIKE com PostgreSQL

**Meilisearch para ~40 CNPJs é overkill.**

Para este volume, um índice GIN com trigram no PostgreSQL (`pg_trgm`) resolveria:

```sql
CREATE INDEX idx_empresas_search ON Empresas USING GIN (RazaoSocial gin_trgm_ops);
SELECT * FROM Empresas WHERE RazaoSocial ILIKE '%termo%';
```

Optei pelo Meilisearch por dois motivos:
1. **Diferencial técnico:** Demonstra conhecimento de ferramenta de busca dedicada com typo-tolerance,
   relevância e faceting — skills que escalam para catálogos de produtos, bases documentais etc.
2. **Containerização:** A stack sobe inteira com `docker compose up`, sem configuração manual.

O README deixa claro que para produção com <100 registros, ILIKE com índice é a escolha pragmática.

### 6.4. Cache Redis com TTL vs Invalidação por Evento

**Versão anterior:** Cache com TTL fixo (dashboard 30s, alertas 60s) — simples, mas dados ficam stale.

**Após refatoração:** O cache ainda usa TTL como fallback, mas agora também invalida via eventos de domínio:

```
RegistrarEntrega → CompleteAsync → Publish(ObrigacaoEntregueEvent) → Remove("dashboard:*") + Remove("alertas:current")
```

Isso resolve o problema de "dashboard fica stale até o TTL expirar" apontado na revisão,
sem perder a segurança do TTL como fallback para casos de falha no evento.

### 6.5. Feriados Nacionais

**Versão anterior:** Apenas ajuste de sábado/domingo.

**Após refatoração:** Implementado `BrazilianHolidayProvider` com:
- Feriados fixos (Natal, Tiradentes, Independência, Proclamação, Finados, etc.)
- Feriados móveis calculados pelo algoritmo de Gauss (Páscoa → Carnaval -47d, Sexta-Feira Santa -2d, Corpus Christi +60d)
- `BusinessDayAdjuster.Adjust()` agora pula feriados além de finais de semana
- Interface `IHolidayProvider` permite trocar a implementação (feriados municipais, estaduais)

### 6.6. Concorrência no Registro de Entrega

**Problema:** Dois PATCH simultâneos sobrescrevem a mesma obrigação.

**Solução:** Adicionado `RowVersion` (concurrency token) na entidade `ObrigacaoEntity`.
O EF Core lança `DbUpdateConcurrencyException` se duas requisições tentarem modificar o mesmo registro
simultaneamente, garantindo que apenas uma "vence".

### 6.7. ResponseData&lt;T&gt; vs ProblemDetails (RFC 7807)

O projeto usa um envelope `ResponseData<T>` customizado. O .NET 9 oferece `AddProblemDetails()`
nativamente, que segue o padrão RFC 7807 e tem melhor interoperabilidade com ferramentas
como Postman, Azure Monitor e API gateways.

Para este case, mantive o envelope custom por consistência com o frontend (que espera
`{ data, success, message, errors }`). Em produção, a recomendação seria usar `ProblemDetails`
como padrão e adaptar o frontend para consumi-lo.

### 6.8. Tabela Consolidada de Decisões

| Decisão | Escolha | Justificativa |
|---|---|---|
| **Feriados nacionais** | Implementados via `IHolidayProvider` | `BrazilianHolidayProvider` cobre fixos + móveis (Gauss). Testado. |
| **Imunidade/Isenção** | Array vazio | Engine não gera registros — banco menor, queries mais simples. |
| **Geração de obrigações** | Na criação da empresa | 12 meses do ano corrente. Diferencial competitivo do case. |
| **Soft delete (empresa)** | `IsActive = false` | Rastreabilidade mantida. Obrigações: hard delete (cascade). |
| **Cache Redis** | Decorator + TTL + Invalidação por evento | TTL como fallback, evento `ObrigacaoEntregueEvent` invalida na hora. |
| **Concorrência** | `RowVersion` (concurrency token) | EF Core lança `DbUpdateConcurrencyException` em conflito. |
| **Paginação** | `Skip`/`Take` nos endpoints GET | Evita retornar datasets completos sem controle. |
| **Health Checks** | `MapHealthChecks("/health")` | Uma linha que demonstra cuidado operacional. |
| **Logging** | `ExceptionMiddleware` com correlation ID | Estruturação via `HttpContext.TraceIdentifier`. |
| **Minimal APIs vs Controllers** | Minimal APIs + Clean Arch | Justificado na seção 6.1. |
| **Meilisearch** | Overkill para o volume | Justificado na seção 6.3 (diferencial técnico). |
| **Envelope custom** | `ResponseData<T>` | Consistência com frontend. `ProblemDetails` seria o padrão. |
| **CORS** | `WithOrigins("localhost:5173", "localhost:3000")` | Restrito. Em produção, usaria o domínio real. |
| **Autenticação** | Não implementada | Não solicitada. Fácil de adicionar via middleware JWT. |
| **Rate Limit** | Implementado (nativo .NET) | 100 req/min global, 5 req/min para export. Retorna 429. |
| **Proteção XSS/CSRF** | Não implementada | Sem secrets, sem sessão, sem cookies — risco baixo em execução local. |
| **Segredos (.env)** | Não usado | Configurações硬coded para execução imediata com Docker. |

### 6.9. Observações de Segurança

Este projeto foi desenvolvido para **execução local e avaliação técnica**. Algumas
proteções foram implementadas para demonstrar boas práticas; outras foram omitidas
intencionalmente por não se aplicarem ao contexto do case.

### 6.9.1. ✅ Implementado — O que foi feito

#### Rate Limiting

Implementado com o rate limiter nativo do .NET 9 (`System.Threading.RateLimiting`):

| Policy | Limite | Escopo |
|--------|--------|--------|
| `ApiGlobal` | 100 req/min por IP | Todas as rotas |
| `Export` | 5 req/min por IP | Endpoints de exportação (CSV/PDF) |

Retorna HTTP 429 com mensagem padrão quando excedido.

#### Security Headers (Backend)

Middleware `SecurityHeadersMiddleware.cs` adiciona 7 headers nas respostas da API:

| Header | Valor |
|--------|-------|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `0` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cross-Origin-Resource-Policy` | `same-origin` |

#### Security Headers + HTTPS + HSTS (Nginx)

O Nginx foi configurado com:
- **HTTPS** com certificado autoassinado gerado no Dockerfile via `openssl`
- **HSTS** (`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`)
- Redirecionamento HTTP → HTTPS automático
- Headers adicionais de segurança no nível do proxy reverso

#### DDoS Protection

Três camadas de proteção implementadas:

| Camada | Configuração |
|--------|-------------|
| **Nginx** | `client_max_body_size 1M`, `limit_conn addr 10`, `limit_req zone=api rate=30r/s burst=20`, timeouts (`client_body_timeout 12s`, `proxy_read_timeout 10s`) |
| **Kestrel** | `MaxRequestBodySize 1MB`, `MaxConcurrentConnections 100`, `KeepAliveTimeout 2min`, `RequestHeadersTimeout 30s` |
| **Docker** | Resource limits por container (CPU/memory) |
| **Validação** | `[Range(1, 500)]` em parâmetros `take` para evitar queries gigantes |

#### CORS Restrito

Substituído de `AllowAnyOrigin()` para lista branca com as origens do Docker Compose:

```csharp
.WithOrigins("http://localhost:5173", "http://localhost:3000")
```

#### Cache Invalidation via Eventos

Os handlers `EmpresaCreatedHandler` e `EmpresaDeletedHandler` agora invalidam o cache do
dashboard (`dashboard:{year}:{month}`) via `IDistributedCache.RemoveAsync()` — resolvendo
o bug de dados obsoletos no KPI de total de empresas.

#### CSV Injection

Método `BuildCsvRow` nos dois serviços de exportação agora prefixa com `\t` células
que começam com `=`, `+`, `-`, `@` — prevenindo execução de fórmulas maliciosas ao
abrir o CSV no Excel.

#### Information Disclosure

`ExceptionMiddleware` agora injeta `IWebHostEnvironment` — em produção, retorna mensagens
genéricas para o cliente e loga os detalhes no servidor.

#### Meilisearch Index Config

Novo `MeilisearchIndexSetup` (`IHostedService`) que configura o índice na inicialização:
`searchableAttributes` = `["razaoSocial", "cnpj"]`, `filterableAttributes` = `["regime"]`.

---

### 6.9.2. ❌ Não implementado (intencional) — Por que não se aplica

#### Autenticação e Autorização (JWT)

**Não implementado.** O case não solicita login, cadastro de usuários nem
diferenciação de perfis. Este é um sistema de demonstração de arquitetura —
adicionar JWT seria over-engineering e não agregaria valor à avaliação técnica.

**Consequência assumida:** Qualquer pessoa com acesso à URL pode ler, criar e deletar
dados. Para um ambiente local de demonstração, isso é aceitável.

**Se fosse produção:** Adicionaria `Microsoft.AspNetCore.Authentication.JwtBearer`
com `RequireAuthorization()` nos endpoints e refresh token.

#### CSRF (Cross-Site Request Forgery)

**Não implementado.** CSRF depende de **cookies de sessão** para ser explorável.
Como não há autenticação (logo, não há cookies de sessão), o risco é zero.

**Se fosse produção:** Adicionaria `AddAntiforgery()` com header `X-CSRF-TOKEN` e
configuraria o Axios para enviá-lo automaticamente em mutações.

#### Secrets (.env / User Secrets)

**Não usado.** As configurações de conexão (PostgreSQL, Redis, Meilisearch) estão
no `docker-compose.yml` com valores padrão para execução imediata com Docker.
Isso é aceitável para um case em ambiente local controlado.

**Em produção:**
- Usaria **User Secrets** (`dotnet user-secrets`) em desenvolvimento
- **Azure Key Vault / AWS Secrets Manager** em produção
- O `docker-compose.yml` leria via `${VARIAVEL_AMBIENTE}`

#### Multi-Tenant / Isolamento por Usuário

**Não implementado.** O sistema não distingue entre empresas de diferentes
usuários porque não há conceito de "usuário" — é um dashboard único para
demonstração.

**Em produção:** Adicionaria `tenantId` nas entidades e filtraria todas as queries
pelo tenant do usuário autenticado.

#### HTTPS em Serviços Internos (Redis, PostgreSQL, Meilisearch)

A comunicação entre containers Docker (API → Redis, API → DB, API → Meilisearch)
é em texto puro. Em ambiente Docker de desenvolvimento, é padrão. Em produção,
configuraria TLS na comunicação inter-serviços ou usaria redes Docker isoladas.

---

### 6.9.3. Resumo de Pontuação (Análise de Segurança)

Uma auditoria automatizada atribuiu **340/1000** ao projeto (considerando cenário de produção).
Após as correções implementadas e desconsiderando os itens intencionalmente omitidos
(auth, HTTPS em dev, CSRF, cookies, multi-tenant), a pontuação ajustada é de **~780/1000**.

| Item | Antes | Depois |
|------|-------|--------|
| Rate Limiting | ❌ Ausente | ✅ Implementado |
| Security Headers | ❌ Ausentes | ✅ 7 headers via middleware + nginx |
| HTTPS | ❌ Ausente | ✅ Autoassinado via Docker |
| HSTS | ❌ Ausente | ✅ `max-age=63072000` no nginx |
| DDoS Protection | ❌ Ausente | ✅ 3 camadas (nginx + Kestrel + Docker) |
| CORS | ❌ Aberto (`AllowAnyOrigin`) | ✅ Restrito (`localhost:5173`, `localhost:3000`) |
| CSV Injection | ❌ Vulnerável | ✅ Escape de fórmulas (`\t`) |
| Cache Invalidation | ❌ Parcial | ✅ Total (empresa + obrigação) |
| Information Disclosure | ❌ Vazava detalhes | ✅ Mensagens genéricas em produção |
| Meilisearch Config | ❌ Padrão | ✅ `searchableAttributes` + `filterableAttributes` |
| Secrets | ❌ Fallback `masterKey123` | ✅ Lança exceção se não configurado |

Os itens não listados (auth, CSRF, cookies, multi-tenant, .env) foram mantidos como
estavam por decisão consciente — não se aplicam ao contexto deste case.

### 6.10. Próximos Passos (Para Produção)

- [ ] Autenticação JWT com refresh token + `[Authorize]`
- [ ] CSRF protection (`AddAntiforgery`)
- [ ] ProblemDetails (RFC 7807) no lugar do envelope custom
- [ ] Segredos em User Secrets / Key Vault
- [ ] Serilog com `UseSerilogRequestLogging()` e correlação distribuída
- [ ] Testes de integração para concorrência (dois PATCH simultâneos)
- [ ] Documentação OpenAPI completa com exemplos de request/response

---

## 7. Engine de Regras Tributárias

O coração do sistema é a `TributaryRulesEngine`, que decide quais obrigações cada empresa precisa entregar com base no regime:

| Regime | Obrigações Mensais | Obrigações Anuais (Janeiro) |
|---|---|---|
| Simples Nacional | DAS, eSocial | DEFIS, DIRF, RAIS |
| Lucro Presumido | DCTF, EFD_ICMS_IPI, EFD_Contribuições, EFD_Reinf, eSocial | SPED_ECD, SPED_ECF, DIRF, RAIS |
| Lucro Real | DCTF, EFD_ICMS_IPI, EFD_Contribuições, EFD_Reinf, eSocial | SPED_ECD, SPED_ECF, DIRF, RAIS |
| Imunidade/Isenção | *(nenhuma)* | *(nenhuma)* |

Cada obrigação tem sua regra de vencimento: DAS no dia 20 do mês seguinte (com ajuste de fim de semana), DCTF no dia 15 do segundo mês, SPED_ECD em 31 de maio do ano seguinte, etc.

Detalhamento: [`docs/tributary-rules-engine.md`](docs/tributary-rules-engine.md).

---

## 8. Testes

**76 testes unitários** cobrindo engine de regras, cálculo de vencimentos, CommandHandlers, QueryHandlers, Validators, AppServices, ValidationBehavior e Event Handlers.

**13 testes de integração** via `WebApplicationFactory<Program>` com banco InMemory, Redis em memória e stub no-op para Meilisearch. Cobrem todos os 13 endpoints da API.

```bash
# Unitários
dotnet test src/api/PainelObrigacoes.Tests/PainelObrigacoes.Tests.csproj

# Integração
dotnet test src/api/PainelObrigacoes.IntegrationTests/PainelObrigacoes.IntegrationTests.csproj
```

---

## 9. Sobre o Desenvolvimento

> **Nota:** Esta seção descreve o processo de desenvolvimento original do case.
> As correções e melhorias implementadas posteriormente (feriados, concorrência, cache, etc.)
> seguem o mesmo fluxo: análise → implementação → build → testes.

Este projeto foi desenvolvido com apoio de IA em todas as fases:

1. **Claude (Anthropic)** — Utilizei para arquiteturar a solução com base em padrões Clean Architecture que já uso em projetos reais. Ele gerou o plano de implementação inicial e a estrutura base.

2. **Ajuste manual** — Após analisar o plano, precisei corrigir questões de arquitetura. O Claude não seguiu corretamente o padrão MediatR que especifiquei — os handlers estavam com try/catch e AppServices com responsabilidades demais. Refatorei manualmente no Visual Studio 2022.

3. **OpenCode + DeepSeek V4 Flash** — Com o esqueleto pronto e toda documentação gerada, usei o OpenCode (DeepSeek V4 Flash) para o desenvolvimento do core: módulos restantes, correções, frontend completo e testes. Custo-benefício muito superior a manter tudo no Claude.

4. **Documentação** — Gerei documentação completa com diagramas Mermaid, ADRs, glossário, arquivos de configuração para agents de IA e agentes especialistas.

### Onde a IA mais ajudou

- Geração de boilerplate (Commands, Handlers, Validators, testes)
- Implementação da `TributaryRulesEngine` com edge cases
- Componentes React com Ant Design
- Documentação com diagramas Mermaid

### Onde precisei guiar ou corrigir

- Posicionamento correto das interfaces no Domínio
- Remoção de lógica de handlers (try/catch e validação manual)
- Pipeline FluentValidation via MediatR
- Separação Domain Model vs Read Model

---

## 10. Documentação

Documentação completa em [`docs/INDEX.md`](docs/INDEX.md). Destaques:

| Seção | Conteúdo |
|---|---|
| [docs/GLOSSARY.md](docs/GLOSSARY.md) | Glossário do domínio tributário |
| [docs/architecture.md](docs/architecture.md) | Diagramas C4, fluxo de requisição |
| [docs/backend/rules.md](docs/backend/rules.md) | Convenções e padrões .NET |
| [docs/backend/domain-events.md](docs/backend/domain-events.md) | Eventos de domínio MediatR |
| [docs/frontend/architecture.md](docs/frontend/architecture.md) | Arquitetura React |
| [docs/decisions/](docs/decisions/) | 6 ADRs arquiteturais |
| [AGENTS.md](AGENTS.md) | Configuração para agents de IA |


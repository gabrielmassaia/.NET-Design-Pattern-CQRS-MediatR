---
created: 2026-06
updated: 2026-06
tags: frontend, architecture, conventions
scope: fe
---

# Frontend — Directory Architecture

> Mapa das pastas `src/web/src/` com responsabilidades e regras de cada camada.

---

## Visão Geral do Fluxo

```
Page → Hook (TanStack Query) → Service → infrastructure/http/axios → API
```

Cada camada tem uma responsabilidade única e bem definida. Nenhuma camada pula a anterior.

---

## `pages/`

Páginas da aplicação — uma pasta por rota.

| Pasta | Rota | Responsabilidade |
|---|---|---|
| `Dashboard/` | `/dashboard` | Visão consolidada com KPIs, alertas, exportação |
| `Empresas/` | `/empresas` | CRUD de empresas, busca, histórico |
| `Calendario/` | `/calendario` | Obrigações por empresa/mês, registro de entrega |

**Regras:**
- Orquestra hooks e componentes, nunca chama axios ou services diretamente
- Gerencia estado de UI (modais, filtros locais)
- Todo estado servidor vem de hooks

---

## `hooks/`

Custom hooks que encapsulam TanStack Query (queries + mutations).

| Arquivo | Queries | Mutations |
|---|---|---|
| `useDashboard.ts` | `useDashboard`, `useAlertas` | — |
| `useEmpresas.ts` | `useEmpresas`, `useEmpresaSearch` | `useCreateEmpresa`, `useDeleteEmpresa` |
| `useObrigacoes.ts` | `useObrigacoes`, `useHistorico` | `useRegistrarEntrega` |

**Regras:**
- Toda comunicação com TanStack Query passa por hooks
- `staleTime` e `refetchInterval` configurados por hook
- Invalidação de queries acontece no `onSuccess` das mutations
- Hooks não têm JSX — extensão `.ts`

---

## `application/services/`

Services HTTP — classes que estendem `BaseService` e fazem chamadas à API.

| Arquivo | Resource | Métodos próprios |
|---|---|---|
| `empresa.service.ts` | `/api/empresas` | `search(q)` |
| `dashboard.service.ts` | `/api/dashboard` | `getDashboard`, `getAlertas`, `exportAlertas`, `exportDashboard` |
| `obrigacao.service.ts` | `/api/obrigacoes` | `findByFilters`, `registrarEntrega`, `getHistorico`, `exportObrigacoes` |

**Regras:**
- Cada service herda de `BaseService<TEntity>` (getAll, getById, create, update, remove)
- Métodos customizados usam `getRequest`, `postRequest`, `patchRequest` protegidos
- Nunca chamam hooks ou componentes diretamente
- Acesso via `@/application/services` (barrel export)

---

## `shared/services/`

`BaseService.ts` — classe abstrata que todos os services estendem.

```
BaseService<TEntity, TCreate, TUpdate>
├── getAll()       → GET /resource
├── getById(id)    → GET /resource/:id
├── create(data)   → POST /resource
├── update(id, d)  → PUT /resource/:id
├── remove(id)     → DELETE /resource/:id
├── getRequest()   → GET genérico (protegido)
├── postRequest()  → POST genérico (protegido)
├── patchRequest() → PATCH genérico (protegido)
└── deleteRequest()→ DELETE genérico (protegido)
```

---

## `infrastructure/http/`

`axios-client.ts` — instância global do Axios com:

- `baseURL` da variável de ambiente `VITE_API_URL`
- Timeout de 10s
- Interceptor de resposta que traduz erros HTTP para `new Error(message)`
- Helpers `getApiData`, `postApiData`, `patchApiData`, `deleteApiData`, `downloadFile`

**Regras:**
- Único ponto de contato com HTTP
- Nunca importado por páginas — só services usam

---

## `domain/types/`

Tipos TypeScript que espelham o contrato da API.

| Arquivo | Tipos |
|---|---|
| `empresa.ts` | `Empresa`, `CreateEmpresaPayload`, `RegimeTributario` |
| `obrigacao.ts` | `Obrigacao`, `StatusObrigacao`, `TipoObrigacao`, `FindObrigacoesParams` |
| `dashboard.ts` | `DashboardData`, `Alerta` |
| `export.ts` | `ExportFormato` |

**Regras:**
- Sem lógica — apenas interfaces e enums
- Nomes em inglês para alinhamento com o backend
- Barrel export via `index.ts`

---

## `shared/types/`

`api-response.ts` — envelope genérico de resposta da API.

```typescript
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode: number | null;
}
```

---

## `shared/utils/`

`export.ts` — utilitário `triggerDownload(blob, filename)` para download de arquivos.

---

## `lib/`

`query-keys.ts` — fábrica de query keys para TanStack Query.

```typescript
export const empresasKeys = {
  all: ['empresas'] as const,
  search: (q: string) => ['empresas', 'search', q] as const,
};
```

**Regras:**
- Todas as query keys centralizadas aqui
- Usa `as const` para inferência de tipos

---

## `utils/`

`formatters.ts` — funções puras de formatação.

| Função | Descrição |
|---|---|
| `formatCnpj(cnpj)` | Formata CNPJ: `11.222.333/0001-81` |
| `formatDate(iso)` | Formata data ISO para `pt-BR` |
| `regimeLabel(num)` | Traduz enum `RegimeTributario` para label |

**Regras:**
- Funções puras — mesmo input, mesmo output
- Sem dependências externas além de `Date`

---

## `context/`

`ThemeContext.tsx` — contexto global de tema (claro/escuro).

- Provider: `ThemeProvider`
- Hook: `useAppTheme`
- Estado persistido em `localStorage`
- Toggle entre `'light'` e `'dark'`

---

## `theme/`

`antd.ts` — configuração de tema do Ant Design.

- `buildTheme(mode: AppTheme)` → retorna `ThemeConfig`
- Paleta completa para modo escuro e claro
- Customização de todos os componentes Ant Design usados

---

## `components/`

Componentes de UI organizados por domínio:

| Pasta | Responsabilidade |
|---|---|
| `ui/` | Componentes genéricos reutilizáveis: `DataTable`, `FilterBar`, `PageHeader`, `StatusBadge`, `RegimeBadge` |
| `dashboard/` | Componentes do Dashboard: `KpiGrid`, `DonutChart`, `AlertasChart`, `AlertasTable`, `StatCard`, `UrgencyRow`, `ChartCard`, `LegendChip` |
| `empresa/` | Componentes de empresa: `EmpresaTable`, `EmpresaForm`, `EmpresaFilters`, `HistoricoDrawer`, `RegimeMatrixModal` |
| `calendario/` | Componentes do calendário: `ObrigacaoTable`, `CalendarFilters`, `ExportButton` |
| `AppSidebar.tsx` | Sidebar de navegação principal |

**Regras:**
- Props tipadas com TypeScript
- Responsabilidade visual única por componente
- Estados contemplados: loading, empty, error, populated
- Sem chamadas HTTP diretas

---

## `test/`

Infraestrutura de testes:

| Arquivo | Função |
|---|---|
| `setup.ts` | Inicializa MSW server, mocks globais (matchMedia, ResizeObserver, localStorage) |
| `render.tsx` | `renderWithProviders` — wrapper com ThemeProvider + QueryClient + Router |
| `mocks/handlers.ts` | MSW handlers para todos os endpoints da API |
| `mocks/server.ts` | Instância do MSW server |

---

## `pages/index.ts`, `components/*/index.ts`, `hooks/index.ts`, `application/services/index.ts`

Barrel exports — reexportam os módulos da pasta para imports limpos com `@/`.

```typescript
// application/services/index.ts
export { empresaService } from './empresa.service';
export { dashboardService } from './dashboard.service';
export { obrigacaoService } from './obrigacao.service';
```

---

## Regras Gerais

| Regra | Explicação |
|---|---|
| `@/` alias | `@/application/services` resolve para `src/web/src/application/services` |
| Naming | Componentes: PascalCase | Pages: `XxxPage.tsx` | Hooks: `useXxx.ts` | Services: `Xxx.service.ts` |
| Testes | Colocados ao lado do arquivo: `Componente.test.tsx` |
| CSS | `index.css` global + Ant Design tokens (sem CSS modules) |

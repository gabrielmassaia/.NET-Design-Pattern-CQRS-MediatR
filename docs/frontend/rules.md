---
created: 2026-06
updated: 2026-06
tags: frontend, conventions, patterns
scope: fe
---

# Frontend Rules

> TypeScript and React coding standards.

---

## Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Components | PascalCase | `EmpresaTable`, `StatusBadge` |
| Files | kebab-case for pages, PascalCase for components | `empresa.service.ts`, `StatusBadge.tsx` |
| Functions | camelCase | `formatCnpj`, `useEmpresas` |
| Interfaces | PascalCase | `Empresa`, `ApiResponse<T>` |
| Enums | PascalCase | `RegimeTributario`, `StatusObrigacao` |
| Types | PascalCase | `CreateEmpresaPayload` |

---

## Layer Responsibilities

### Page
- Orchestrates layout and UI state
- Injects hooks, never calls axios directly
- Composes components

### Component
- Receives typed props
- Renders UI, emits events
- Single visual responsibility

### Hook
- Encapsulates server state with TanStack Query
- Abstracts queries and mutations
- Pages depend on hook interface, not HTTP implementation

### Service
- Pure functions encapsulating HTTP calls
- Adding an endpoint = new function, no page/hook modification

### api/axios
- Base instance with baseURL, timeout, error interceptor

---

## Data Fetching Pattern

```typescript
// Service (empresa.service.ts)
export async function findAll(): Promise<Empresa[]> {
  const { data } = await api.get<ApiResponse<Empresa[]>>('/api/empresas');
  return data.data;
}

// Hook (useEmpresas.ts)
export function useEmpresas() {
  return useQuery({
    queryKey: ['empresas'],
    queryFn: empresaService.findAll,
    staleTime: 30_000,
  });
}

// Mutation (useEmpresas.ts)
export function useCreateEmpresa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: empresaService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['empresas'] }),
  });
}

// Page (EmpresasPage.tsx)
function EmpresasPage() {
  const { data: empresas, isLoading } = useEmpresas();
  const { mutateAsync: create, isPending } = useCreateEmpresa();
  // ...
}
```

---

## Type Safety

All API types are defined in `types/index.ts` and used throughout:

```typescript
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode: number | null;
}

export interface Empresa {
  id: string;
  cnpj: string;
  razaoSocial: string;
  regime: RegimeTributario;
  createdAt: string;
}
```

---

## Component Rules

1. **MUST** use TypeScript for all files
2. **MUST** define Props interface for every component
3. **MUST NOT** use `any` — prefer `unknown` or explicit types
4. **MUST** handle loading and error states
5. **MUST** use `dayjs` with pt-BR locale for date formatting
6. **MUST** use Ant Design components for layout and forms
7. **MUST NOT** make HTTP calls directly in components
8. **SHOULD** use functional components with hooks

---

## Testing

### Commands

```bash
npm run test          # Run once
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

### Stack

- **Vitest** — test runner
- **React Testing Library** — component rendering
- **@testing-library/user-event** — user interaction simulation
- **MSW** (Mock Service Worker) — HTTP mocking
- **@testing-library/jest-dom** — DOM matchers

### Patterns

- Tests are colocated next to source files (`Component.test.tsx`)
- Use `renderWithProviders` from `@/test/render` for all component/page tests
- This wraps the component with: `ConfigProvider` (Ant Design theme), `QueryClientProvider` (TanStack Query with retry disabled), `MemoryRouter`, and `ThemeProvider`
- Use `userEvent.setup()` for async interactions
- Prefer `getByRole`, `getByText`, `getByPlaceholderText` over `getByTestId`
- API calls are intercepted by MSW handlers in `src/test/mocks/handlers.ts`
- Hooks tests use `renderHook` with a wrapper providing only `QueryClientProvider`

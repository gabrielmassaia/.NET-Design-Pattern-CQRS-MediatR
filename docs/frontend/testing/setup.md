---
created: 2026-06
updated: 2026-06
tags: frontend, testing
scope: fe
---

# Frontend Testing — Setup

> Testing configuration for the React frontend.

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| Vitest | 4.1.8 | Test runner |
| @testing-library/react | 16.3 | Component rendering |
| @testing-library/jest-dom | 6.9 | DOM matchers |
| @testing-library/user-event | 14.6 | User interaction simulation |
| MSW | 2.14 | HTTP mocking |
| @vitest/coverage-v8 | 4.1 | Code coverage (v8) |

---

## Configuration (vite.config.ts)

```typescript
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: './src/test/setup.ts',
  css: true,
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html', 'lcov'],
    exclude: [
      'src/main.tsx',
      'src/vite-env.d.ts',
      '**/*.d.ts',
      '**/types/**',
      '**/mocks/**',
      '**/test/**',
    ],
  },
},
```

---

## Running Tests

```bash
cd src/web

# Run once
npm run test
# or: npx vitest run

# Watch mode
npm run test:watch
# or: npx vitest

# With coverage
npm run test:coverage
# or: npx vitest run --coverage
```

---

## Test Infrastructure

### renderWithProviders

All component/page tests use a shared wrapper that provides:

- **ConfigProvider** — Ant Design theme (dark mode)
- **ThemeProvider** — App theme context
- **QueryClientProvider** — TanStack Query with retry disabled
- **MemoryRouter** — React Router for navigation

```typescript
import { renderWithProviders, screen, userEvent } from '@/test/render';

it('renders with data', async () => {
  renderWithProviders(<Component />);
  expect(await screen.findByText('Title')).toBeInTheDocument();
});
```

### MSW Handlers

API calls are intercepted by MSW in `src/test/mocks/handlers.ts`:

```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://localhost:8080/api/empresas', () => {
    return HttpResponse.json({
      success: true,
      data: [{ id: '1', razaoSocial: 'Empresa Exemplo Ltda', ... }],
      errorCode: null,
    });
  }),
];
```

The MSW server is started/stopped in `src/test/setup.ts` automatically.

---

## Patterns by Type

### Component Tests

```tsx
import { renderWithProviders, screen, userEvent } from '@/test/render';

describe('ComponentName', () => {
  it('renders and allows interaction', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<ComponentName open onClose={onClose} />);

    await user.click(screen.getByText('Salvar'));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
```

### Hook Tests

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

it('fetches data', async () => {
  const { result } = renderHook(() => useMyHook(), { wrapper: createWrapper() });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toHaveLength(2);
});
```

### Service Tests (mocked axios)

```tsx
import { api } from '@/infrastructure/http/axios-client';

vi.mock('@/infrastructure/http/axios-client', () => ({
  api: { get: vi.fn(), post: vi.fn(), /* ... */ },
}));

it('calls the correct URL', async () => {
  (api.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    data: { success: true, data: [...], errorCode: null },
  });

  const result = await myService.getAll();
  expect(api.get).toHaveBeenCalledWith('/api/endpoint');
});
```

---

## Coverage

Current coverage (após implementação dos testes):

| Métrica | % |
|---|---|
| Statements | 87.68% |
| Branches | 86.87% |
| Functions | 82.16% |
| Lines | 87.59% |

Excluded from coverage: `main.tsx`, `vite-env.d.ts`, `*.d.ts`, `types/**`, `mocks/**`, `test/**`.

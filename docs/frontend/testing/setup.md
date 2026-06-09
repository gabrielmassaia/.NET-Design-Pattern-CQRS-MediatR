---
created: 2026-06
updated: 2026-06
tags: frontend, testing
scope: fe
---

# Frontend Testing — Setup

> Testing configuration for the React frontend.

---

## Recommended Setup

```bash
cd src/web

# Install test dependencies
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### vite.config.ts

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

### src/test/setup.ts

```typescript
import '@testing-library/jest-dom';
```

---

## Running Tests

```bash
# Run once
npx vitest run

# Watch mode
npx vitest

# With coverage
npx vitest run --coverage
```

---

## What to Test

- **Hooks** — Query and mutation behavior with mocked services
- **Components** — Render states (loading, empty, error, populated)
- **Forms** — Validation, submission, error display
- **Utils** — Pure function tests (formatCnpj, formatDate, regimeLabel)

---

## Test Pattern

```typescript
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function createWrapper() {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('ComponentName', () => {
  it('renders loading state', () => {
    render(<ComponentName />, { wrapper: createWrapper() });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
```

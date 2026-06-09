---
created: 2026-06
updated: 2026-06
tags: frontend, testing, best-practices
scope: fe
---

# Frontend Testing — Best Practices

---

## What to Test

### Hooks
- Query retrieves data correctly
- Mutation calls service and invalidates queries
- Loading states are tracked
- Error states are handled

### Components
- Renders loading skeleton/spinner
- Renders empty state message
- Renders error state
- Renders data correctly
- User interactions fire expected callbacks

### Utils
- `formatCnpj`: pads and formats CNPJ string
- `formatDate`: parses ISO and formats pt-BR
- `regimeLabel`: maps enum to label
- Edge cases: null/undefined inputs, malformed strings

---

## What NOT to Test

- Third-party library internals (Ant Design, TanStack Query)
- HTTP layer (tested in service functions with mocks)
- Exact CSS/styling details

---

## Mocking Strategy

```typescript
// Mock the service module
vi.mock('../services/empresa.service', () => ({
  findAll: vi.fn(),
  create: vi.fn(),
}));

// Mock TanStack Query response
import { useQuery } from '@tanstack/react-query';
vi.mocked(useQuery).mockReturnValue({
  data: mockData,
  isLoading: false,
  error: null,
});
```

---

## File Organization

```
src/__tests__/
├── components/
│   ├── StatusBadge.test.tsx
│   └── EmpresaForm.test.tsx
├── hooks/
│   └── useEmpresas.test.ts
└── utils/
    └── formatters.test.ts
```

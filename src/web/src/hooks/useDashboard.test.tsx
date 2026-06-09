import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useDashboard, useAlertas } from './useDashboard';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useDashboard', () => {
  it('fetches dashboard data', async () => {
    const { result } = renderHook(() => useDashboard(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toMatchObject({
      totalEmpresas: 5,
      totalObrigacoesMes: 12,
      pendentes: 7,
      entregues: 3,
      atrasadas: 2,
    });
  });
});

describe('useAlertas', () => {
  it('fetches alertas list', async () => {
    const { result } = renderHook(() => useAlertas(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data![0]).toMatchObject({ tipoNome: 'DAS' });
    expect(result.current.data![1]).toMatchObject({ tipoNome: 'DCTF' });
  });
});

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useObrigacoes, useRegistrarEntrega, useHistorico } from './useObrigacoes';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useObrigacoes', () => {
  it('fetches obligations for valid params', async () => {
    const { result } = renderHook(
      () => useObrigacoes({ empresaId: '1', ano: 2026, mes: 6 }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data![0].tipoNome).toBe('DAS');
  });

  it('returns empty for unknown empresa', async () => {
    const { result } = renderHook(
      () => useObrigacoes({ empresaId: '999', ano: 2026, mes: 6 }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(0);
  });
});

describe('useHistorico', () => {
  it('fetches historico for a company', async () => {
    const { result } = renderHook(() => useHistorico('1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data![0].tipoNome).toBe('DAS');
  });
});

describe('useRegistrarEntrega', () => {
  it('registers delivery successfully', async () => {
    const { result } = renderHook(() => useRegistrarEntrega(), { wrapper: createWrapper() });

    result.current.mutate({ id: 'o1', payload: {} });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe(3);
  });
});

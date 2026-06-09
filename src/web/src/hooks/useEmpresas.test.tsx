import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useEmpresas, useEmpresaSearch, useCreateEmpresa, useDeleteEmpresa } from './useEmpresas';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useEmpresas', () => {
  it('fetches and returns companies list', async () => {
    const { result } = renderHook(() => useEmpresas(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data![0]).toMatchObject({ razaoSocial: 'Empresa Exemplo Ltda' });
    expect(result.current.data![1]).toMatchObject({ razaoSocial: 'Comércio Brasil S.A.' });
  });
});

describe('useEmpresaSearch', () => {
  it('returns filtered results for matching query', async () => {
    const { result } = renderHook(() => useEmpresaSearch('exemplo'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data![0].razaoSocial).toBe('Empresa Exemplo Ltda');
  });

  it('returns empty results for non-matching query', async () => {
    const { result } = renderHook(() => useEmpresaSearch('zzzzz'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(0);
  });
});

describe('useCreateEmpresa', () => {
  it('creates a company successfully', async () => {
    const { result } = renderHook(() => useCreateEmpresa(), { wrapper: createWrapper() });

    result.current.mutate({ cnpj: '99888777000155', razaoSocial: 'Nova Empresa', regime: 1 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toMatchObject({ razaoSocial: 'Nova Empresa' });
  });
});

describe('useDeleteEmpresa', () => {
  it('deletes a company successfully', async () => {
    const { result } = renderHook(() => useDeleteEmpresa(), { wrapper: createWrapper() });

    result.current.mutate('1');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

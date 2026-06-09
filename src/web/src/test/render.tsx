import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { buildTheme } from '@/theme/antd';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

type CustomRenderOptions = RenderOptions & {
  route?: string;
};

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {},
) {
  const queryClient = createTestQueryClient();
  const route = options.route ?? '/';

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <ConfigProvider theme={buildTheme('dark')}>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={[route]}>
              {children}
            </MemoryRouter>
          </QueryClientProvider>
        </ThemeProvider>
      </ConfigProvider>
    );
  }

  return { ...render(ui, { wrapper: Wrapper, ...options }), queryClient };
}

export * from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';

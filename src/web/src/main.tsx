import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { App as AntApp, ConfigProvider } from 'antd';
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { useAppTheme, ThemeProvider } from '@/context/ThemeContext';
import { routes } from '@/routes';
import { buildTheme } from '@/theme/antd';
import '@fontsource/dm-mono/400.css';
import '@fontsource/plus-jakarta-sans/300.css';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
    mutations: {
      onError: (error: unknown) => { console.error('[QueryClient mutation error]', error); },
    },
  },
});

function ThemedApp() {
  const { appTheme } = useAppTheme();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', appTheme);
  }, [appTheme]);

  return (
    <ConfigProvider theme={buildTheme(appTheme)}>
      <AntApp>
        <AppRoutes />
      </AntApp>
    </ConfigProvider>
  );
}

function AppRoutes() {
  return useRoutes(routes);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ThemedApp />
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);

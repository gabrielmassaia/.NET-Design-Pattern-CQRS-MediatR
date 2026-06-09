import { createContext, useContext, useState, type ReactNode } from 'react';

export type AppTheme = 'light' | 'dark';

interface ThemeContextValue {
  appTheme: AppTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  appTheme: 'dark',
  toggleTheme: () => {},
});

function getInitialTheme(): AppTheme {
  const stored = localStorage.getItem('app-theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [appTheme, setAppTheme] = useState<AppTheme>(getInitialTheme);

  function toggleTheme() {
    setAppTheme((current) => {
      const next = current === 'light' ? 'dark' : 'light';
      localStorage.setItem('app-theme', next);
      return next;
    });
  }

  return (
    <ThemeContext.Provider value={{ appTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useAppTheme = () => useContext(ThemeContext);

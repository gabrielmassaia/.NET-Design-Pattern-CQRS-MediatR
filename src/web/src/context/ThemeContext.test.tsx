import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useAppTheme } from './ThemeContext';
import type { ReactNode } from 'react';

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with dark theme by default', () => {
    const { result } = renderHook(() => useAppTheme(), {
      wrapper: ({ children }: { children: ReactNode }) => <ThemeProvider>{children}</ThemeProvider>,
    });
    expect(result.current.appTheme).toBe('dark');
  });

  it('toggles theme from dark to light', () => {
    const { result } = renderHook(() => useAppTheme(), {
      wrapper: ({ children }: { children: ReactNode }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    act(() => result.current.toggleTheme());

    expect(result.current.appTheme).toBe('light');
    expect(localStorage.getItem('app-theme')).toBe('light');
  });

  it('toggles theme back from light to dark', () => {
    localStorage.setItem('app-theme', 'light');

    const { result } = renderHook(() => useAppTheme(), {
      wrapper: ({ children }: { children: ReactNode }) => <ThemeProvider>{children}</ThemeProvider>,
    });
    expect(result.current.appTheme).toBe('light');

    act(() => result.current.toggleTheme());
    expect(result.current.appTheme).toBe('dark');
    expect(localStorage.getItem('app-theme')).toBe('dark');
  });

  it('uses persisted theme from localStorage', () => {
    localStorage.setItem('app-theme', 'light');

    const { result } = renderHook(() => useAppTheme(), {
      wrapper: ({ children }: { children: ReactNode }) => <ThemeProvider>{children}</ThemeProvider>,
    });
    expect(result.current.appTheme).toBe('light');
  });

  it('ignores invalid localStorage value and defaults to dark', () => {
    localStorage.setItem('app-theme', 'invalid');

    const { result } = renderHook(() => useAppTheme(), {
      wrapper: ({ children }: { children: ReactNode }) => <ThemeProvider>{children}</ThemeProvider>,
    });
    expect(result.current.appTheme).toBe('dark');
  });
});

import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
const KEY = 'n10-theme';

function readTheme(): Theme {
  try {
    return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

// Light by default; dark only when the player picks it
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b0f1e' : '#f8fafc');
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      // Storage blocked: theme still applies for this visit
    }
  }, [theme]);

  return { theme, toggle: () => setTheme(t => (t === 'dark' ? 'light' : 'dark')) };
}

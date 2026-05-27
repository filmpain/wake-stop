import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'wakestop_theme';

const getSystemTheme = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {}, setMode: () => {} });

export const ThemeProvider = ({ children }) => {
  // `manual` is true when the user explicitly picked a theme; otherwise follow system.
  const [manual, setManual] = useState(false);
  const [theme, setTheme] = useState(() => getSystemTheme());

  // On mount, load any stored override
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      setManual(true);
      setTheme(stored);
    } else {
      setManual(false);
      setTheme(getSystemTheme());
    }
  }, []);

  // Listen for system color-scheme changes when not manually overridden
  useEffect(() => {
    if (manual) return;
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, [manual]);

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  const setMode = (mode) => {
    setManual(true);
    setTheme(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  };

  const toggleTheme = () => setMode(theme === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
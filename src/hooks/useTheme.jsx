/* eslint-disable react-refresh/only-export-components */

import { useCallback, useContext, createContext, useState, useEffect, useMemo } from 'react';
import { themePalettes, THEME_MODE } from '../config/themes';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const initialThemeState = useMemo(() => {
    const storedBase = localStorage.getItem('themeBase');
    const storedMode = localStorage.getItem('themeMode');
    const legacyTheme = localStorage.getItem('theme');

    if (storedBase && themePalettes[storedBase]) {
      return {
        base: storedBase,
        mode: storedMode === THEME_MODE.dark ? THEME_MODE.dark : THEME_MODE.light
      };
    }

    if (legacyTheme) {
      if (legacyTheme === 'dark') {
        return { base: 'default', mode: THEME_MODE.dark };
      }

      if (themePalettes[legacyTheme]) {
        return { base: legacyTheme, mode: THEME_MODE.light };
      }
    }

    return { base: 'default', mode: THEME_MODE.light };
  }, []);

  const [themeName, setThemeName] = useState(() => initialThemeState.base);
  const [themeMode, setThemeMode] = useState(() => initialThemeState.mode);

  const applyTheme = useCallback((theme) => {
    Object.entries(theme).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
  }, []);

  const setTheme = useCallback((baseName, mode = THEME_MODE.light) => {
    const nextBase = themePalettes[baseName] ? baseName : 'default';
    const nextMode = mode === THEME_MODE.dark ? THEME_MODE.dark : THEME_MODE.light;

    setThemeName(nextBase);
    setThemeMode(nextMode);

  }, []);

  const themeValues = useMemo(() => {
    return themePalettes[themeName]?.[themeMode] || themePalettes.default.light;
  }, [themeMode, themeName]);

  useEffect(() => {
    applyTheme(themeValues);
  }, [applyTheme, themeValues]);

  useEffect(() => {
    localStorage.setItem('themeBase', themeName);
    localStorage.setItem('themeMode', themeMode);
    localStorage.removeItem('theme');
  }, [themeMode, themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, themeMode, setTheme, themeValues, themePalettes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default useTheme;

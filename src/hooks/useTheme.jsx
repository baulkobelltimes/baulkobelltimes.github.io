import { useCallback, useContext, createContext, useState, useEffect } from 'react';
import { themes } from '../config/themes';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState(() => {
    return localStorage.getItem('theme') || 'default';
  });
  const [themeValues, setThemeValues] = useState(themes.default);

  const applyTheme = useCallback((theme) => {
    Object.entries(theme).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
    setThemeValues(theme);
  }, []);

  const setTheme = useCallback((name) => {
    setThemeName(name);
    localStorage.setItem('theme', name);
    const theme = themes[name] || themes.default;
    applyTheme(theme);
  }, [applyTheme]);

  useEffect(() => {
    if (themes[themeName]) {
      setTheme(themeName);
    } else {
      setTheme('default');
    }
  }, [themeName, setTheme]);

  return (
    <ThemeContext.Provider value={{ themeName, setTheme, themeValues, themes }}>
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

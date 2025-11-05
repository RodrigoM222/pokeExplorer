import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('pokemon-theme') as Theme;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    return saved || (systemPrefersDark ? 'dark' : 'light');
  });

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    localStorage.setItem('pokemon-theme', theme);
    
    document.body.className = theme;
    
    const root = document.documentElement;
    if (theme === 'dark') {
      // Colores base
      root.style.setProperty('--bg-primary', '#1a1a1a');
      root.style.setProperty('--bg-secondary', '#2d2d2d');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#e0e0e0');
      
      // Componentes específicos
      root.style.setProperty('--card-bg', '#333333');
      root.style.setProperty('--card-border', '#444444');
      root.style.setProperty('--accent-primary', '#3b82f6');
      root.style.setProperty('--accent-secondary', '#1e40af');
      root.style.setProperty('--text-on-accent', '#ffffff');
      
      // Modal
      root.style.setProperty('--modal-bg', '#374151');
      root.style.setProperty('--modal-border', '#4b5563');
      root.style.setProperty('--modal-close-bg', '#4b5563');
      root.style.setProperty('--modal-close-hover', '#6b7280');
      
      // Stats y tipos
      root.style.setProperty('--types-container-bg', 'rgba(55, 65, 81, 0.9)');
      root.style.setProperty('--favorite-bg', '#4b5563');
      root.style.setProperty('--stat-bg', '#4b5563');
      root.style.setProperty('--stat-text', '#ffffff');
      root.style.setProperty('--ability-bg', '#4b5563');
      root.style.setProperty('--ability-text', '#ffffff');
      root.style.setProperty('--hidden-ability-bg', '#6b7280');
      root.style.setProperty('--hidden-ability-hover', '#9ca3af');
      root.style.setProperty('--accent-yellow', '#fbbf24');
    } else {
      // Colores base
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f5f5f5');
      root.style.setProperty('--text-primary', '#000000');
      root.style.setProperty('--text-secondary', '#666666');
      
      // Componentes específicos
      root.style.setProperty('--card-bg', '#FFDE00');
      root.style.setProperty('--card-border', '#000000');
      root.style.setProperty('--accent-primary', '#20d');
      root.style.setProperty('--accent-secondary', '#2A75BB');
      root.style.setProperty('--text-on-accent', '#ffffff');
      
      // Modal
      root.style.setProperty('--modal-bg', '#FFDE00');
      root.style.setProperty('--modal-border', '#000000');
      root.style.setProperty('--modal-close-bg', '#000000');
      root.style.setProperty('--modal-close-hover', '#333333');
      
      // Stats y tipos
      root.style.setProperty('--types-container-bg', 'rgba(255, 255, 255, 0.9)');
      root.style.setProperty('--favorite-bg', '#ffffff');
      root.style.setProperty('--stat-bg', '#FFDE00');
      root.style.setProperty('--stat-text', '#000000');
      root.style.setProperty('--ability-bg', '#FFDE00');
      root.style.setProperty('--ability-text', '#000000');
      root.style.setProperty('--hidden-ability-bg', '#4B4B4B');
      root.style.setProperty('--hidden-ability-hover', '#666666');
      root.style.setProperty('--accent-yellow', '#FFDE00');
    }
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

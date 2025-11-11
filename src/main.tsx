import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Pokedex from './components/Pokedex'
import { LoadingProvider } from './contexts/LoadingContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import { ThemeProvider } from './contexts/ThemeContext'
import GlobalLoading from './components/GlobalLoading'
import ThemeToggle from './components/ThemeToggle'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LoadingProvider>
        <FavoritesProvider>
          <GlobalLoading />
          <ThemeToggle />
          <Pokedex />
        </FavoritesProvider>
      </LoadingProvider>
    </ThemeProvider>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Pokedex from './components/Pokedex'
import { LoadingProvider } from './contexts/LoadingContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import GlobalLoading from './components/GlobalLoading'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoadingProvider>
      <FavoritesProvider>
        <GlobalLoading />
        <Pokedex />
      </FavoritesProvider>
    </LoadingProvider>
  </StrictMode>,
)

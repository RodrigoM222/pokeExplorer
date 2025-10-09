import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Pokedex from './components/Pokedex'
import { LoadingProvider } from './context/LoadingContext'
import GlobalLoading from './components/GlobalLoading'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoadingProvider>
      <GlobalLoading />
      <Pokedex />
    </LoadingProvider>
  </StrictMode>,
)

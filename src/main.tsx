import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main>
      <img src='' alt='/default-pokemon.png'></img>
      <h2>Bienvenidos a esta nueva Pokedex, donde podran tener información importante sobre todos los pokemones del juego.</h2>
    </main>
  </StrictMode>,
)

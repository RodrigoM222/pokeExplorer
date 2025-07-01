import React, { useState } from 'react';
import SearchBar from './SearchBar';
import { fetchPokemon } from '../services/PokeServices';
import type { PokemonAPIResponse } from '../services/PokeServices';
import CreatureCardModal from './CreatureModal';


export default function Pokedex() {
  const [pokemons, setPokemons] = useState<PokemonAPIResponse[]>([]);

  async function handleSearch(query: string) {
    const result = await fetchPokemon(query);
    if (result) {
      setPokemons([result]);
    } else {
      setPokemons([]);
    }
  }

  return (
    <>
  <SearchBar onSearch={handleSearch} />
  <div className="pokedex-list">
    {pokemons.map((pokemon) => (
      <CreatureCardModal 
        key={pokemon.id}
        image={pokemon.sprites.front_default}
        id={pokemon.id}
        name={pokemon.name}
        type={pokemon.types[0].type.name}
      />
    ))}
  </div>
</>

  );
}

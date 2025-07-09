import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import CreatureCardModal from './CreatureModal';
import { fetchPokemon } from '../services/PokeServices';
import type { PokemonAPIResponse } from '../services/PokeServices';
import './Pokedex.css';

type Stats = {
  hp: number | null;
  attack: number | null;
  defense: number | null;
  speed: number | null;
};

type Pokemon = {
  id: number | null;
  name: string | null;
  type: string | null;
  skills: string[];
  evolution: string | null;
  stats: Stats;
  badges: string[];
  evolutionChain: string[];
  image: string | null;
};

function mapApiToPokemon(apiData: PokemonAPIResponse): Pokemon {
  return {
    id: apiData.id,
    name: apiData.name,
    type: apiData.types[0]?.type.name ?? null,
    skills: [],
    evolution: null,
    stats: { hp: null, attack: null, defense: null, speed: null },
    badges: [],
    evolutionChain: [],
    image: apiData.sprites.front_default
  };
}

export default function Pokedex() {
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    async function loadInitialPokemons() {
      const starters = ["bulbasaur", "charmander", "squirtle"];
      
      const results = await Promise.all(
        starters.map(async (name) => {
          const data = await fetchPokemon(name);
          return data ? mapApiToPokemon(data) : null;
        })
      ).then(pokemons => pokemons.filter((pokemon): pokemon is Pokemon => pokemon !== null));
      
      setAllPokemons(results);
      setFilteredPokemons(results);
    }
  
    loadInitialPokemons();
  }, []);  

  function handleSearch(query: string) {
    const lowerQuery = query.toLowerCase();
    const filtered = allPokemons.filter(p =>
      p.name?.includes(lowerQuery) ||
      String(p.id).includes(lowerQuery)
    );
    setFilteredPokemons(filtered);
  }

  return (
    <>
      <SearchBar onSearch={handleSearch} />

      <main>
        <img src='https://avatars.githubusercontent.com/u/19692032?s=280&v=4' alt=''></img>
        <h2>Bienvenidos a esta nueva Pokedex, donde podrán tener información importante sobre todos los Pokémones del juego.</h2>
      </main>

      <div className="pokedex-list">
        {filteredPokemons.map((pokemon) => (
          <CreatureCardModal 
            key={pokemon.id ?? 0}
            image={pokemon.image ?? ''}
            id={pokemon.id ?? 0}
            name={pokemon.name ?? ''}
            type={pokemon.type ?? ''}
          />
        ))}
      </div>
    </>
  );
}

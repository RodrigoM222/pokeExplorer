import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import CreatureCardModal from './CreatureModal';
import { fetchPokemon } from '../services/PokeServices';
import type { PokemonAPIResponse } from '../services/PokeServices';
import type { Pokemon, PokemonType } from '../types';
import './Pokedex.css';
import PokeAPI from '../assets/PokeAPI.png';

function mapApiToPokemon(apiData: PokemonAPIResponse): Pokemon {
  return {
    id: apiData.id,
    name: apiData.name,
    types: apiData.types.map(t => t.type.name as PokemonType),
    skills: [],
    evolution: [],
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
      try {
        const starters = ["bulbasaur", "charmander", "squirtle"];
        const pokemonsData = await Promise.all(
          starters.map(async (name) => {
            const data = await fetchPokemon(name);
            return data ? mapApiToPokemon(data) : null;
          })
        );

        const results = pokemonsData.filter((p): p is Pokemon => p !== null);

        setAllPokemons(results);
        setFilteredPokemons(results);
      } catch (error) {
        console.error("Error loading initial pokemons:", error);
        
        setAllPokemons([]);
        setFilteredPokemons([]);
      }
    }

    loadInitialPokemons();
  }, []);

  function handleSearch(query: string) {
    const lowerQuery = query.toLowerCase();
    const filtered = allPokemons.filter(p =>
      p.name?.includes(lowerQuery) || String(p.id).includes(lowerQuery)
    );
    setFilteredPokemons(filtered);
  }

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <main className='Pokedex'>
        <img src={PokeAPI} alt='logo PokéApi' />
        <h2>Bienvenidos a esta nueva Pokedex, donde podrán tener información importante sobre todos los Pokémones del juego.</h2>
      </main>

      <div className="pokedex-list">
        {filteredPokemons.map((pokemon) => (
          <CreatureCardModal 
            key={pokemon.id ?? 0}
            pokemon={pokemon}
          />
        ))}
      </div>
    </>
  );
}

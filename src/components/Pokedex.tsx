import React, { useEffect, useState, useRef, useCallback } from 'react';
import SearchBar from './SearchBar';
import CreatureCard from './CreatureCard';
import { fetchPokemon, fetchAllPokemonBasicInfo } from '../services/PokeServices';
import type { Pokemon, PokemonType, BasicPokemonInfo } from '../types';
import './Pokedex.css';

const MAX_POKEMON = 1025;
const PAGE_SIZE = 20;

const validPokemonTypes: PokemonType[] = [
  "normal", "fire", "water", "grass", "electric",
  "ice", "fighting", "poison", "ground", "flying",
  "psychic", "bug", "rock", "ghost", "dragon",
  "dark", "steel", "fairy"
];

export default function Pokedex() {
  const [allBasicInfo, setAllBasicInfo] = useState<BasicPokemonInfo[]>([]);
  const [filteredInfo, setFilteredInfo] = useState<BasicPokemonInfo[]>([]);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const mapApiDataToPokemon = (apiData: any): Pokemon => {
    const stats = apiData.stats.reduce((acc: any, stat: any) => {
      if (stat.stat.name === 'hp') acc.hp = stat.base_stat;
      if (stat.stat.name === 'attack') acc.attack = stat.base_stat;
      if (stat.stat.name === 'defense') acc.defense = stat.base_stat;
      if (stat.stat.name === 'speed') acc.speed = stat.base_stat;
      return acc;
    }, { hp: 0, attack: 0, defense: 0, speed: 0 });

    return {
      id: apiData.id,
      name: apiData.name,
      types: apiData.types.map((t: any) => {
        const typeName = t.type.name.toLowerCase();
        return validPokemonTypes.includes(typeName as PokemonType)
          ? typeName as PokemonType
          : 'normal';
      }),
      skills: apiData.abilities.map((a: any) => a.ability.name),
      evolution: [],
      stats,
      badges: [],
      evolutionChain: [],
      image: apiData.sprites.other?.['official-artwork']?.front_default || apiData.sprites.front_default || null
    };
  };

  useEffect(() => {
    async function loadBasicInfo() {
      const info = await fetchAllPokemonBasicInfo();
      const limited = info.slice(0, MAX_POKEMON);
      setAllBasicInfo(limited);
      setFilteredInfo(limited);
    }
    loadBasicInfo();
  }, []);

  useEffect(() => {
    async function loadVisiblePokemons() {
      if (filteredInfo.length === 0) {
        setPokemons([]);
        return;
      }

      setIsLoading(true);
      const slice = filteredInfo.slice(0, visibleCount);
      const data = await Promise.all(
        slice.map(async ({ name }) => {
          try {
            const apiData = await fetchPokemon(name);
            return apiData ? mapApiDataToPokemon(apiData) : null;
          } catch (error) {
            console.error(`Error al cargar el Pokémon ${name}:`, error);
            return null;
          }
        })
      );
      setPokemons(data.filter((p): p is Pokemon => p !== null));
      setIsLoading(false);
    }

    loadVisiblePokemons();
  }, [filteredInfo, visibleCount]);

  useEffect(() => {
    if (!bottomRef.current) return;

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => {
          if (prev >= MAX_POKEMON) return prev;
          return Math.min(prev + PAGE_SIZE, MAX_POKEMON);
        });
      }
    }, { threshold: 0.1 });

    observer.current.observe(bottomRef.current);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  const handleSearch = useCallback((query: string) => {
    const lower = query.toLowerCase();
    const filtered = allBasicInfo.filter(p =>
      p.name.includes(lower) || String(p.id).includes(lower)
    );
    setFilteredInfo(filtered);
    setVisibleCount(PAGE_SIZE);
  }, [allBasicInfo]);

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <main className="Pokedex">
        <img src='https://avatars.githubusercontent.com/u/19692032?s=280&v=4' alt='logo PokeAPI' />
        <h2>Bienvenidos a esta nueva Pokedex donde podras encontrar información sobre los Pokemones del juego.</h2>
      </main>

      <div className="pokedex-list">
        {isLoading ? (
          <p className="loading">Cargando...</p>
        ) : pokemons.length > 0 ? (
          pokemons.map((pokemon) => (
            <CreatureCard
              key={pokemon.id}
              pokemon={pokemon}
            />
          ))
        ) : (
          <p className="no-results">
            No se encontraron coincidencias con tu búsqueda.  
            Pruebe con otro nombre o número de Pokédex.
          </p>
        )}
        <div ref={bottomRef} style={{ height: 1 }} />
      </div>
    </>
  );
}

import React, { useEffect, useState, useRef, useCallback } from 'react';
import SearchBar from './SearchBar';
import CreatureCardModal from './CreatureModal';
import { fetchPokemon, fetchAllPokemonBasicInfo } from '../services/PokeServices';
import type { Pokemon } from '../types';
import './Pokedex.css';

export default function Pokedex() {
  const [allBasicInfo, setAllBasicInfo] = useState<{ name: string; id: number }[]>([]);
  const [filteredInfo, setFilteredInfo] = useState<{ name: string; id: number }[]>([]);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const observer = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadBasicInfo() {
      const info = await fetchAllPokemonBasicInfo();
      setAllBasicInfo(info);
      setFilteredInfo(info);
    }
    loadBasicInfo();
  }, []);

  useEffect(() => {
    async function loadVisiblePokemons() {
      const slice = filteredInfo.slice(0, visibleCount);
      const data = await Promise.all(
        slice.map(async ({ name }) => {
          const apiData = await fetchPokemon(name);
          return apiData ? {
            id: apiData.id,
            name: apiData.name,
            types: apiData.types.map(t => t.type.name),
            skills: [],
            evolution: [],
            stats: { hp: null, attack: null, defense: null, speed: null },
            badges: [],
            evolutionChain: [],
            image: apiData.sprites.front_default,
          } : null;
        })
      );
      setPokemons(data.filter(p => p !== null) as Pokemon[]);
    }
    if (filteredInfo.length > 0) {
      loadVisiblePokemons();
    }
  }, [filteredInfo, visibleCount]);

  useEffect(() => {
    if (!bottomRef.current) return;
    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisibleCount((prev) => prev + 20);
      }
    });
    observer.current.observe(bottomRef.current);
    return () => observer.current?.disconnect();
  }, [bottomRef]);

  const handleSearch = useCallback((query: string) => {
    const lower = query.toLowerCase();
    const filtered = allBasicInfo.filter(p =>
      p.name.includes(lower) || String(p.id).includes(lower)
    );
    setFilteredInfo(filtered);
    setVisibleCount(20);
  }, [allBasicInfo]);

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <main className="Pokedex">
        <img src='https://avatars.githubusercontent.com/u/19692032?s=280&v=4' alt='logo'/>
        <h2>Bienvenidos a esta nueva Pokedex, donde podrán tener información importante sobre todos los Pokémones del juego.</h2>
      </main>

      <div className="pokedex-list">
          {pokemons.map((pokemon) => (
            <CreatureCardModal 
              key={pokemon.id ?? 0}
              pokemon={pokemon}
            />
          ))}
        <div ref={bottomRef} style={{ height: 1 }} />
      </div>
    </>
  );
}

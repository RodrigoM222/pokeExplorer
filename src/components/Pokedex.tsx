import React, { useEffect, useState, useRef, useCallback } from 'react';
import SearchBar from './SearchBar';
import CreatureCard from './CreatureCard';
import { 
  fetchPokemon, 
  fetchPokemonList, 
  searchPokemonByName, 
  MAX_ID, 
  MIN_ID 
} from '../services/PokeServices';
import type { Pokemon, PokemonType } from '../types';
import './Pokedex.css';

const PAGE_SIZE = 20;

const validPokemonTypes: PokemonType[] = [
  "normal", "fire", "water", "grass", "electric",
  "ice", "fighting", "poison", "ground", "flying",
  "psychic", "bug", "rock", "ghost", "dragon",
  "dark", "steel", "fairy"
];

export default function Pokedex() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchError, setSearchError] = useState<string>('');

  const observer = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const mapApiDataToPokemon = (apiData: any): Pokemon => {
    const stats = apiData.stats?.reduce((acc: any, stat: any) => {
      if (stat.stat.name === 'hp') acc.hp = stat.base_stat;
      if (stat.stat.name === 'attack') acc.attack = stat.base_stat;
      if (stat.stat.name === 'defense') acc.defense = stat.base_stat;
      if (stat.stat.name === 'speed') acc.speed = stat.base_stat;
      return acc;
    }, { hp: 0, attack: 0, defense: 0, speed: 0 }) || { hp: 0, attack: 0, defense: 0, speed: 0 };

    return {
      id: apiData.id,
      name: apiData.name,
      types: apiData.types.map((t: any) => {
        const typeName = t.type.name.toLowerCase();
        return validPokemonTypes.includes(typeName as PokemonType)
          ? typeName as PokemonType
          : 'normal';
      }),
      skills: apiData.abilities?.map((a: any) => a.ability.name) || [],
      evolution: [],
      stats,
      badges: [],
      evolutionChain: [],
      image:
        apiData.sprites.other?.['official-artwork']?.front_default ||
        apiData.sprites.front_default ||
        null
    };
  };

  const validateInput = (input: string): string | null => {
    const trimmed = input.trim();
    
    if (trimmed === '') {
      return null;
    }

    const numericRegex = /^\d+$/;
    if (numericRegex.test(trimmed)) {
      return 'numeric';
    }

    const nameRegex = /^[a-zA-Z\-]+$/;
    if (nameRegex.test(trimmed)) {
      return 'text';
    }

    return 'invalid';
  };

  const loadPokemons = useCallback(async (currentOffset: number) => {
    if (isLoading || !hasMore || query.trim() !== '') return;

    setIsLoading(true);
    setSearchError('');
    
    const list = await fetchPokemonList(currentOffset, PAGE_SIZE);

    if (list.length === 0) {
      setHasMore(false);
      setIsLoading(false);
      return;
    }

    const data = await Promise.all(
      list.map(async (p) => {
        const apiData = await fetchPokemon(p.name);
        return apiData ? mapApiDataToPokemon(apiData) : null;
      })
    );

    const validPokemons = data.filter((p): p is Pokemon => p !== null);
    
    setPokemons((prev) => {
      const existingIds = new Set(prev.map(p => p.id));
      const newPokemons = validPokemons.filter(p => !existingIds.has(p.id));
      return [...prev, ...newPokemons];
    });

    setOffset(currentOffset + PAGE_SIZE);
    setIsLoading(false);
    setIsInitialLoad(false);
  }, [isLoading, hasMore, query]);

  const handleSearch = useCallback(async (value: string) => {
    const trimmed = value.trim();
    setQuery(trimmed);
    setSearchError('');

    if (trimmed === '') {
      setPokemons([]);
      setOffset(0);
      setHasMore(true);
      setIsInitialLoad(true);
      return;
    }

    const inputType = validateInput(trimmed);
    
    if (inputType === 'invalid') {
      setSearchError('Caracteres inválidos. Use solo números para ID o letras y guiones para nombres');
      setPokemons([]);
      return;
    }

    setIsLoading(true);

    if (inputType === 'numeric') {
      const id = Number(trimmed);
      
      if (id < MIN_ID) {
        setSearchError(`El número debe ser mayor o igual a ${MIN_ID}.`);
        setPokemons([]);
        setIsLoading(false);
        return;
      }
      
      if (id > MAX_ID) {
        setSearchError(`El número debe ser menor o igual a ${MAX_ID}.`);
        setPokemons([]);
        setIsLoading(false);
        return;
      }

      try {
        const result = await fetchPokemon(String(id));
        if (result) {
          setPokemons([mapApiDataToPokemon(result)]);
        } else {
          setSearchError('Pokémon no encontrado');
          setPokemons([]);
        }
      } catch (error) {
        setSearchError('Error al buscar Pokémon');
        setPokemons([]);
      }
      setIsLoading(false);
      return;
    }

    if (inputType === 'text') {
      try {
        const lowercaseQuery = trimmed.toLowerCase();
        const searchResults = await searchPokemonByName(lowercaseQuery);

        if (searchResults.length === 0) {
          setSearchError('No se encontraron Pokémon con ese nombre');
          setPokemons([]);
          setIsLoading(false);
          return;
        }

        const dataWithDetails = await Promise.all(
          searchResults.slice(0, 30).map(async (p) => {
            try {
              const apiData = await fetchPokemon(p.name);
              return apiData ? mapApiDataToPokemon(apiData) : null;
            } catch (error) {
              console.error(`Error fetching details for ${p.name}:`, error);
              return null;
            }
          })
        );

        const validResults = dataWithDetails.filter((p): p is Pokemon => p !== null);
        setPokemons(validResults);
        
        if (validResults.length === 0) {
          setSearchError('Pokémon no encontrado');
        }
      } catch (error) {
        console.error('Error en búsqueda:', error);
        setSearchError('Error al realizar la búsqueda');
        setPokemons([]);
      }
      
      setIsLoading(false);
      return;
    }
  }, []);

  useEffect(() => {
    if (!bottomRef.current || query.trim() !== '' || !hasMore) return;

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading) {
        loadPokemons(offset);
      }
    }, { threshold: 0.1 });

    if (bottomRef.current) {
      observer.current.observe(bottomRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loadPokemons, query, hasMore, isLoading, offset]);

  useEffect(() => {
    if (isInitialLoad && query.trim() === '' && pokemons.length === 0) {
      loadPokemons(0);
    }
  }, [isInitialLoad, query, pokemons.length, loadPokemons]);

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <main className="Pokedex">
        <img 
          src="https://avatars.githubusercontent.com/u/19692032?s=280&v=4" 
          alt="logo PokeAPI" 
          className="pokedex-logo"
        />
        <h2>Bienvenidos a esta nueva Pokedex donde podrás encontrar información sobre los Pokemones.</h2>
      </main>

      <div className="pokedex-list">
        {searchError && (
          <div className="message-container">
            <p className="error-message"> {searchError}</p>
          </div>
        )}

        {pokemons.length > 0 ? (
          <div className="pokemon-grid">
            {pokemons.map((pokemon) => (
              <CreatureCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        ) : (
          !isLoading && query.trim() !== '' && !searchError && (
            <div className="message-container">
              <p className="no-results">No se encontraron coincidencias con tu búsqueda.</p>
            </div>
          )
        )}
        
        {isLoading && (
          <div className="message-container">
            <p className="loading">Cargando...</p>
          </div>
        )}
        
        <div ref={bottomRef} className="observer-element" />
      </div>
    </>
  );
}

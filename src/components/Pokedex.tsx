import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';

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

export default function Pokedex() {
  
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

    useEffect(() => {
      const mockData: Pokemon[] = [];
      setPokemonList(mockData);
    }, []);

    const pokemonIds = pokemonList.map(p => p.id);  

  return (
    <>
        <SearchBar 
            pokemonIds={pokemonIds}
        />
    </>
  );
}

//        <div className='card'>
//            <img src={image.pokemon}></img>
//           <p>#{id.pokemon}</p>
//            <ul>
//                <li><p>Name: {pokemon.name}</p></li>
//                <li><p>Type: {pokemon.type}</p></li>
//            </ul>
//        </div>

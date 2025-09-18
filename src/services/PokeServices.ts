export type PokemonAPIResponse = {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other?: {
      ['official-artwork']?: {
        front_default?: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  abilities?: {
    ability: {
      name: string;
    };
  }[];
  stats?: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  height?: number;
  weight?: number;
  base_experience?: number;
};

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

export const MAX_ID = 1025;
export const MIN_ID = 1;

export async function fetchPokemon(query: string): Promise<PokemonAPIResponse | null> {
  try {
    const response = await fetch(`${BASE_URL}/${query.toLowerCase()}`);
    if (!response.ok) throw new Error('Pokémon no encontrado');
    return (await response.json()) as PokemonAPIResponse;
  } catch (error) {
    console.error('Error buscando Pokémon:', error);
    return null;
  }
}

export async function fetchPokemonList(
  offset = 0,
  limit = 20
): Promise<{ name: string; id: number }[]> {
  try {
    const res = await fetch(`${BASE_URL}?offset=${offset}&limit=${limit}`);
    const data = await res.json();
    return data.results.map((p: { name: string; url: string }) => {
      const match = p.url.match(/\/pokemon\/(\d+)\//);
      const id = match ? parseInt(match[1], 10) : 0;
      return { name: p.name, id };
    });
  } catch (error) {
    console.error('Error al obtener la lista de Pokémon:', error);
    return [];
  }
}

export async function searchPokemonByName(query: string): Promise<{ name: string; id: number }[]> {
  try {
    const res = await fetch(`${BASE_URL}?limit=${MAX_ID}`);
    const data = await res.json();
    
    return data.results
      .filter((p: { name: string }) => p.name.toLowerCase().includes(query.toLowerCase()))
      .map((p: { name: string; url: string }) => {
        const match = p.url.match(/\/pokemon\/(\d+)\//);
        const id = match ? parseInt(match[1], 10) : 0;
        return { name: p.name, id };
      })
      .slice(0, 30);
    
  } catch (error) {
    console.error('Error en búsqueda por nombre:', error);
    return [];
  }
}

export async function searchPokemonAdvanced(
  query: string, 
  page: number = 1, 
  limit: number = 20
): Promise<{ results: { name: string; id: number }[]; total: number }> {
  try {
    const SEARCH_URL = '/api/pokemon/search';
    const res = await fetch(
      `${SEARCH_URL}?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
    
    if (!res.ok) throw new Error('Error en búsqueda');
    
    const data = await res.json();
    return {
      results: data.results,
      total: data.total
    };
    
  } catch (error) {
    console.error('Error en búsqueda avanzada:', error);
    return { results: [], total: 0 };
  }
}

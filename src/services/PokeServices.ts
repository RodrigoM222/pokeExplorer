export type PokemonAPIResponse = {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
};

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

export async function fetchPokemon(query: string): Promise<PokemonAPIResponse | null> {
  try {
    const response = await fetch(`${BASE_URL}/${query.toLowerCase()}`);
    if (!response.ok) throw new Error('Pokémon no encontrado');
    const data: PokemonAPIResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error buscando Pokémon:', error);
    return null;
  }
}

export async function fetchAllPokemonBasicInfo(): Promise<{ name: string; id: number }[]> {
  try {
    const response = await fetch(`${BASE_URL}?limit=1025`);
    if (!response.ok) throw new Error('Error al obtener la lista de Pokémon');
    const data = await response.json();
    return data.results.map((pokemon: { name: string }, index: number) => ({
      name: pokemon.name,
      id: index + 1,
    }));
  } catch (error) {
    console.error('Error al obtener la lista de Pokémon:', error);
    return [];
  }
}

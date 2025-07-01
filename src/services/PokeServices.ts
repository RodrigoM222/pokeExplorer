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

  
  export async function fetchPokemon(query: string): Promise<PokemonAPIResponse | null> {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
      if (!response.ok) throw new Error('Pokémon no encontrado');
      const data: PokemonAPIResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error buscando Pokémon:', error);
      return null;
    }
  }
  
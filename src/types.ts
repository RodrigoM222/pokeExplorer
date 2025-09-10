export type PokemonType = 
  | "normal"
  | "fire"
  | "water"
  | "grass"
  | "electric"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

export type Stat = {
  name: string;
  base_stat: number;
};

export type Stats = {
  hp: number | null;
  attack: number | null;
  defense: number | null;
  speed: number | null;
};

export type Ability = {
  ability: {
  name: string;
  };
};

export type Pokemon = {
  id: number | null;
  name: string | null;
  types: PokemonType[];
  skills: string[];
  evolution: string[];  // Siguiente evolución
  stats: Stats;
  badges: string[];
  evolutionChain: string[]; // Toda la cadena de evolución
  image: string | null;
};

export type BasicPokemonInfo = {
  name: string;
  id: number;
};

export const typeStyles: Record<PokemonType | string, { backgroundColor: string; color: string }> = {
  normal: { backgroundColor: '#A8A878', color: '#FFFFFF' },
  fire: { backgroundColor: '#F08030', color: '#FFFFFF' },
  water: { backgroundColor: '#6890F0', color: '#FFFFFF' },
  grass: { backgroundColor: '#78C850', color: '#FFFFFF' },
  electric: { backgroundColor: '#F8D030', color: '#000000' },
  ice: { backgroundColor: '#98D8D8', color: '#000000' },
  fighting: { backgroundColor: '#C03028', color: '#FFFFFF' },
  poison: { backgroundColor: '#A040A0', color: '#FFFFFF' },
  ground: { backgroundColor: '#E0C068', color: '#000000' },
  flying: { backgroundColor: '#A890F0', color: '#FFFFFF' },
  psychic: { backgroundColor: '#F85888', color: '#FFFFFF' },
  bug: { backgroundColor: '#A8B820', color: '#FFFFFF' },
  rock: { backgroundColor: '#B8A038', color: '#FFFFFF' },
  ghost: { backgroundColor: '#705898', color: '#FFFFFF' },
  dragon: { backgroundColor: '#7038F8', color: '#FFFFFF' },
  dark: { backgroundColor: '#705848', color: '#FFFFFF' },
  steel: { backgroundColor: '#B8B8D0', color: '#000000' },
  fairy: { backgroundColor: '#EE99AC', color: '#000000' },
  default: { backgroundColor: '#68A090', color: '#FFFFFF' }
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

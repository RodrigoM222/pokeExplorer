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

export type Stats = {
  hp: number | null;
  attack: number | null;
  defense: number | null;
  speed: number | null;
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

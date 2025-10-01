export type PokemonType =
  | "normal" | "fire" | "water" | "grass" | "electric"
  | "ice" | "fighting" | "poison" | "ground" | "flying"
  | "psychic" | "bug" | "rock" | "ghost" | "dragon"
  | "dark" | "steel" | "fairy";

export type Stat = {
  name: string;
  base_stat: number;
};

export type Stats = {
  hp: number | null;
  attack: number | null;
  defense: number | null;
  speed: number | null;
  special_attack?: number | null;
  special_defense?: number | null;
};

export type PokemonAbility = {
  name: string;
  isHidden: boolean;
};

export type Pokemon = {
  id: number | null;
  name: string | null;
  types: PokemonType[];
  evolution: string[];
  stats: Stats;
  badges: string[];
  evolutionChain: string[];
  image: string | null;
  height?: number;
  weight?: number;
  base_experience?: number;
  abilities?: PokemonAbility[];
};

export type PokemonWithAbilities = Pokemon & {
  abilities?: PokemonAbility[];
};

export type BasicPokemonInfo = {
  name: string;
  id: number;
};

export const capitalizeFirst = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

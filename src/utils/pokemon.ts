import type { Stats, Stat } from '../types';

export function extractStats(stats: Stat[] ): Stats {
  return {
    hp: stats?.find(s => s.name === 'hp')?.base_stat || 0,
    attack: stats?.find(s => s.name === 'attack')?.base_stat || 0,
    defense: stats?.find(s => s.name === 'defense')?.base_stat || 0,
    speed: stats?.find(s => s.name === 'speed')?.base_stat || 0,
    special_attack: stats?.find(s => s.name === 'special-attack')?.base_stat || 0,
    special_defense: stats?.find(s => s.name === 'special-defense')?.base_stat || 0,
  };
}

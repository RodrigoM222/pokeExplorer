import type { Stats, Stat } from '../types';

export function extractStats(data: { stats: Stat[] }): Stats {
  return {
    hp: data.stats?.find(s => s.name === 'hp')?.base_stat || 0,
    attack: data.stats?.find(s => s.name === 'attack')?.base_stat || 0,
    defense: data.stats?.find(s => s.name === 'defense')?.base_stat || 0,
    speed: data.stats?.find(s => s.name === 'speed')?.base_stat || 0,
    special_attack: data.stats?.find(s => s.name === 'special-attack')?.base_stat || 0,
    special_defense: data.stats?.find(s => s.name === 'special-defense')?.base_stat || 0,
  };
}

import React, { useEffect, useState, useCallback } from 'react';
import type { Pokemon } from '../types';
import { fetchPokemon } from '../services/PokeServices';
import TypeBadgesList from './TypeBadgesList';
import './CreatureModal.css';

interface CreatureModalProps {
  pokemonId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_POKEMON_IMAGE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';

export default function CreatureModal({ pokemonId, isOpen, onClose }: CreatureModalProps) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

const loadPokemonDetails = useCallback(async (id: number) => {
  setIsLoading(true);
  setError('');
  
  try {
    const data = await fetchPokemon(id.toString());
    if (data) {
      const details: Pokemon = {
        id: data.id,
        name: data.name,
        types: data.types.map((t: any) => t.type.name),
        evolution: [],
        stats: {
          hp: data.stats?.find((s: any) => s.stat.name === 'hp')?.base_stat || null,
          attack: data.stats?.find((s: any) => s.stat.name === 'attack')?.base_stat || null,
          defense: data.stats?.find((s: any) => s.stat.name === 'defense')?.base_stat || null,
          speed: data.stats?.find((s: any) => s.stat.name === 'speed')?.base_stat || null,
          special_attack: data.stats?.find((s: any) => s.stat.name === 'special-attack')?.base_stat || null,
          special_defense: data.stats?.find((s: any) => s.stat.name === 'special-defense')?.base_stat || null,
        },
        badges: [],
        evolutionChain: [],
        image: data.sprites?.other?.['official-artwork']?.front_default || 
               data.sprites?.front_default || 
               DEFAULT_POKEMON_IMAGE,
        // API returns height in decimeters; convert to meters.
        height: data.height ? data.height / 10 : undefined,
        // API returns weight in hectograms; convert to kilograms.
        weight: data.weight ? data.weight / 10 : undefined,
        base_experience: data.base_experience,
        abilities: data.abilities?.map((a: any) => a.ability.name) || []
      };
      setPokemon(details);
    } else {
      setError('Pokémon no encontrado');
    }
  } catch (err) {
    setError('No pudimos cargar los detalles. Intenta nuevamente.');
  } finally {
    setIsLoading(false);
  }
}, []);

  useEffect(() => {
    if (isOpen && pokemonId) {
      loadPokemonDetails(pokemonId);
    }
  }, [isOpen, pokemonId, loadPokemonDetails]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar modal">
          ×
        </button>

        {isLoading && (
          <div className="modal-loading">
            <div className="loading-spinner"></div>
            <p>Cargando detalles...</p>
          </div>
        )}

        {error && (
          <div className="modal-error">
            <p>{error}</p>
            <button onClick={() => pokemonId && loadPokemonDetails(pokemonId)}>
              Reintentar
            </button>
          </div>
        )}

        {pokemon && !isLoading && !error && (
          <div className="modal-body">
            <div className="modal-header">
              <span className="modal-id">#{pokemon.id?.toString().padStart(3, '0')}</span>
              <h2 className="modal-name">{pokemon.name}</h2>
            </div>

            <div className="modal-image-container">
              <img 
                src={pokemon.image || DEFAULT_POKEMON_IMAGE} 
                alt={pokemon.name || 'Pokémon'} 
                className="modal-image"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_POKEMON_IMAGE;
                }}
              />
            </div>

            <div className="modal-types">
              <TypeBadgesList types={pokemon.types} size="medium" />
            </div>

            <div className="modal-stats">
              <div className="stat-row">
                <div className="stat-item">
                  <span className="stat-label">Altura</span>
                  <span className="stat-value">{pokemon.height ? `${pokemon.height}m` : 'N/A'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Peso</span>
                  <span className="stat-value">{pokemon.weight ? `${pokemon.weight}kg` : 'N/A'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Experiencia</span>
                  <span className="stat-value">{pokemon.base_experience || 'N/A'}</span>
                </div>
              </div>

              <div className="stat-section">
                <h3>Habilidades</h3>
                <div className="abilities">
                  {pokemon.abilities?.map((ability, index) => (
                    <span key={index} className="ability-badge">
                      {ability}
                    </span>
                  ))}
                </div>
              </div>

              <div className="stat-section">
                <h3>Estadísticas Base</h3>
                <div className="stats-grid">
                  <div className="stat">
                    <span>HP</span>
                    <strong>{pokemon.stats.hp || 0}</strong>
                  </div>
                  <div className="stat">
                    <span>ATK</span>
                    <strong>{pokemon.stats.attack || 0}</strong>
                  </div>
                  <div className="stat">
                    <span>DEF</span>
                    <strong>{pokemon.stats.defense || 0}</strong>
                  </div>
                  <div className="stat">
                    <span>SpA</span>
                    <strong>{pokemon.stats.special_attack || 0}</strong>
                  </div>
                  <div className="stat">
                    <span>SpD</span>
                    <strong>{pokemon.stats.special_defense || 0}</strong>
                  </div>
                  <div className="stat">
                    <span>SPD</span>
                    <strong>{pokemon.stats.speed || 0}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

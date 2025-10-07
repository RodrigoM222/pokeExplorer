import React, { useEffect, useState, useCallback } from 'react';
import type { Pokemon } from '../types';
import { fetchPokemon, fetchEvolutionChain, type EvolutionStage } from '../services/PokeServices';
import TypeBadgesList from './TypeBadgesList';
import { extractStats } from '../utils/pokemon';
import './CreatureModal.css';

interface CreatureModalProps {
  pokemonId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

interface PokemonAbility {
  name: string;
  isHidden: boolean;
}

interface PokemonWithAbilities extends Pokemon {
  abilities?: PokemonAbility[];
}

const DEFAULT_POKEMON_IMAGE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';

export default function CreatureModal({ pokemonId, isOpen, onClose }: CreatureModalProps) {
  const [pokemon, setPokemon] = useState<PokemonWithAbilities | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const [evolutionStages, setEvolutionStages] = useState<EvolutionStage[]>([]);
  const [isEvolutionLoading, setIsEvolutionLoading] = useState(false);
  const [evolutionError, setEvolutionError] = useState('');

  const loadPokemonDetails = useCallback(async (id: number) => {
    setIsLoading(true);
    setError('');
    setEvolutionStages([]);
    setEvolutionError('');

    try {
      const data = await fetchPokemon(id.toString());
      if (data) {
        const details: PokemonWithAbilities = {
          id: data.id,
          name: data.name,
          types: data.types.map((t: any) => t.type.name),
          evolution: [],
          evolutionChain: [],
          stats: extractStats({
            stats: data.stats?.map((s: any) => ({
              name: s.stat.name,
              base_stat: s.base_stat,
            })) || [],
          }),
          badges: [],
          image:
            data.sprites?.other?.['official-artwork']?.front_default ||
            data.sprites?.front_default ||
            DEFAULT_POKEMON_IMAGE,
          height: data.height ? data.height / 10 : undefined,
          weight: data.weight ? data.weight / 10 : undefined,
          base_experience: data.base_experience,
          abilities:
            data.abilities?.map((a: any) => ({
              name: a.ability.name,
              isHidden: a.is_hidden,
            })) || [],
        };
        setPokemon(details);

        setIsEvolutionLoading(true);
        try {
          const evoData = await fetchEvolutionChain(data.id);
          setEvolutionStages(evoData);
        } catch {
          setEvolutionError('No pudimos cargar la cadena de evolución');
        } finally {
          setIsEvolutionLoading(false);
        }
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

  const renderStatBar = (label: string, value: number) => (
    <div className="stat">
      <span>{label}</span>
      <div
        className="stat-bar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={255}
        role="progressbar"
      >
        <div className="bar-fill" style={{ width: `${(value / 255) * 100}%` }} />
      </div>
      <strong>{value}</strong>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
            <button onClick={() => pokemonId && loadPokemonDetails(pokemonId)}>Reintentar</button>
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
                    <span
                      key={index}
                      className={`ability-badge ${ability.isHidden ? 'hidden-ability' : ''}`}
                      title={ability.isHidden ? 'Habilidad oculta' : ''}
                    >
                      {ability.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="stat-section">
                <h3>Estadísticas Base</h3>
                <div className="stats-grid">
                  {renderStatBar('HP', pokemon.stats.hp || 0)}
                  {renderStatBar('ATK', pokemon.stats.attack || 0)}
                  {renderStatBar('DEF', pokemon.stats.defense || 0)}
                  {renderStatBar('SpA', pokemon.stats.special_attack || 0)}
                  {renderStatBar('SpD', pokemon.stats.special_defense || 0)}
                  {renderStatBar('SPD', pokemon.stats.speed || 0)}
                </div>
              </div>

              <div className="stat-section">
                <h3>Cadena Evolutiva</h3>
                {isEvolutionLoading && <p>Cargando cadena evolutiva...</p>}
                {evolutionError && <p>{evolutionError}</p>}
                {!isEvolutionLoading && !evolutionError && (
                  <div className="evolution-chain">
                    {evolutionStages.length === 0 ? (
                      <p>Este Pokémon no tiene evoluciones.</p>
                    ) : (
                      evolutionStages.map((stage, index) => (
                        <div key={stage.id} className="evolution-stage">
                          <img
                            src={stage.image || DEFAULT_POKEMON_IMAGE}
                            alt={stage.name}
                            className="evolution-image"
                            onError={(e) => {
                              e.currentTarget.src = DEFAULT_POKEMON_IMAGE;
                            }}
                          />
                          <p>{stage.name}</p>
                          {index < evolutionStages.length - 1 && (
                            <span className="evolution-arrow">→</span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

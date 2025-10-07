import React from 'react';
import type { EvolutionStage } from '../services/PokeServices';
import './EvolutionChain.css';

interface EvolutionChainProps {
  stages: EvolutionStage[];
  isLoading: boolean;
  error: string;
}

export default function EvolutionChain({ stages, isLoading, error }: EvolutionChainProps) {
  if (isLoading) return <p>Cargando cadena evolutiva...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!stages.length) return <p>Este Pokémon no tiene evoluciones.</p>;

  return (
    <div className="evolution-chain">
      {stages.map((stage, index) => (
        <div key={stage.id} className="evolution-stage">
          <img
            src={stage.image || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png'}
            alt={stage.name}
            onError={(e) => {
              e.currentTarget.src =
                'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
            }}
          />
          <p>{stage.name}</p>
          {index < stages.length - 1 && <span className="evolution-arrow">→</span>}
        </div>
      ))}
    </div>
  );
}

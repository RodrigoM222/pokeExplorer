import React from 'react';
import type { PokemonType } from '../types';
import TypeBadge from './TypeBadge';
import './TypeBadgesList.css';

interface TypeBadgesListProps {
  types: PokemonType[];
  size?: 'small' | 'medium' | 'large';
}

const TypeBadgesList: React.FC<TypeBadgesListProps> = ({ types, size = 'medium' }) => {
  if (!types || types.length === 0) return null;

  return (
    <div className="type-badges-list" aria-label="Pokémon types">
      {types.map((type, index) => (
        <TypeBadge
          key={`${type}-${index}`}
          type={type}
          size={size}
        />
      ))}
    </div>
  );
};

export default TypeBadgesList;

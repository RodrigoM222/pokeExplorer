import React from 'react';
import type { PokemonType } from '../types';
import { capitalizeFirst } from '../types';
import './TypeBadge.css';

type TypeBadgeProps = {
  type: PokemonType | string;
  size?: 'small' | 'medium' | 'large';
};

export default function TypeBadge({ type, size = 'medium' }: TypeBadgeProps) {
  const normalizedType = type.toLowerCase();
  const displayName = capitalizeFirst(normalizedType);

  const typeClass = `type-badge--${normalizedType}`;
  const isValidType = [
    'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting',
    'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost',
    'dragon', 'dark', 'steel', 'fairy'
  ].includes(normalizedType);

  const badgeClass = `type-badge type-badge--${size} ${isValidType ? typeClass : 'type-badge--default'}`;

  return (
    <span
      className={badgeClass}
      aria-label={`Type: ${displayName}`}
      title={displayName}
    >
      {displayName}
    </span>
  );
}

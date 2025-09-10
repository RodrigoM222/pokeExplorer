import React from 'react';
import type { PokemonType } from '../types';
import { typeStyles, capitalizeFirst } from '../types';
import './TypeBadge.css';

type TypeBadgeProps = {
  type: PokemonType | string;
  size?: 'small' | 'medium' | 'large';
};

export default function TypeBadge({ type, size = 'medium' }: TypeBadgeProps) {
  const normalizedType = type.toLowerCase();
  
  const style = typeStyles[normalizedType as PokemonType] || typeStyles.default;
  const displayName = capitalizeFirst(normalizedType);

  return (
    <span
      className={`type-badge type-badge--${size}`}
      style={{
        backgroundColor: style.backgroundColor,
        color: style.color
      }}
      aria-label={`Type: ${displayName}`}
      title={displayName}
    >
      {displayName}
    </span>
  );
}

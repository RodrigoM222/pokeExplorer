import React from 'react';
import './FavoriteButton.css';

interface FavoriteButtonProps {
  pokemonId: number;
  isFavorite: boolean;
  onToggle: (pokemonId: number) => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function FavoriteButton({ 
  pokemonId, 
  isFavorite, 
  onToggle, 
  size = 'medium',
  className = ''
}: FavoriteButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(pokemonId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(pokemonId);
    }
  };

  return (
    <button
      className={`favorite-button ${isFavorite ? 'favorite-button--active' : ''} favorite-button--${size} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={isFavorite ? `Remover ${pokemonId} de favoritos` : `Agregar ${pokemonId} a favoritos`}
      title={isFavorite ? 'Remover de favoritos' : 'Agregar a favoritos'}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={isFavorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
}

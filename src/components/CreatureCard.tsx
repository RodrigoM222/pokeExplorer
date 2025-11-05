import React from 'react';
import type { Pokemon } from '../types';
import TypeBadgeList from './TypeBadgesList';
import FavoriteButton from './FavoriteButton';
import { useFavorites } from '../contexts/FavoritesContext';
import './CreatureCard.css';

type CreatureCardProps = {
  pokemon: Pokemon;
  onClick?: () => void;
};

export default function CreatureCard({ pokemon, onClick }: CreatureCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <div 
      className="card" 
      role="article" 
      aria-label={`Pokémon ${pokemon.name}`} 
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="card__image-container">
        <img 
          src={pokemon.image ?? ''} 
          alt={pokemon.name ?? 'Pokémon'} 
          className="card__image"
        />
        <FavoriteButton
          pokemonId={pokemon.id!}
          isFavorite={isFavorite(pokemon.id!)}
          onToggle={toggleFavorite}
          size="small"
          className="card__favorite"
        />
      </div>
      
      <div className="card__content">
        <strong className="card__id">#{pokemon.id?.toString().padStart(3, '0')}</strong>
        
        <h3 className="card__name">{pokemon.name}</h3>
        
        <div className="card__types" aria-label="Pokémon types">
          <TypeBadgeList
            types={pokemon.types || []}
            size="small"
          />
        </div>
      </div>
    </div>
  );
}

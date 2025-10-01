import React from 'react';
import type { Pokemon } from '../types';
import TypeBadgeList from './TypeBadgesList';
import TypeBadge from './TypeBadge';
import './CreatureCard.css';

type CreatureCardProps = {
  pokemon: Pokemon;
  onClick?: () => void;
};

export default function CreatureCard({ pokemon, onClick }: CreatureCardProps) {
  return (
    <div className="card" role="article" aria-label={`Pokémon ${pokemon.name}`} onClick={onClick}>
      <img 
        src={pokemon.image ?? ''} 
        alt={pokemon.name ?? 'Pokémon'} 
        className="card__image"
      />
      
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

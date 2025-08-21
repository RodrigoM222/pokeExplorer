import React from 'react';
import type { Pokemon } from '../types';
import './CreatureCard.css';

type CreatureCardProps = {
  pokemon: Pokemon;
};

export default function CreatureCard({ pokemon }: CreatureCardProps) {
  return (
    <div className="card">
      <img src={pokemon.image ?? ''} alt={`${pokemon.name}`} />
      <strong>#{pokemon.id}</strong>
      <ul className="info">
        <li><p>Name: {pokemon.name}</p></li>
        <li>
          <p>Type/s:</p>
          <ul>
            {pokemon.types.map((type, idx) => (
              <li key={`${pokemon.name}_${idx}`}>{type}</li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
}

import React from 'react';
import type { Pokemon } from '../types';
import './CreatureModal.css';

type CreatureCardModalProps = {
  pokemon: Pokemon;
};

export default function CreatureCardModal({ pokemon }: CreatureCardModalProps) {
  return (
    <div className="card">
      <img src={pokemon.image ?? ''} alt={`${pokemon.name}`} />
      <p>#{pokemon.id}</p>
      <ul>
        <li><p>Name: {pokemon.name}</p></li>
        <li>
          <p>Types:</p>
          <ul>
            {pokemon.types.map((type, idx) => (
              <li key={idx}>{type}</li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
}

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
      <strong>#{pokemon.id}</strong>
      <ul className='info'>
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

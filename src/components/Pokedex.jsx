import React from 'react';

const pokemon = [
    { id: null,
      name: null,
      type: null,
      skills: [],
      evolution: null,
      stats: { hp: null, attack: null, defense: null, speed: null },
      badges: [],
      evolutionChain: [],
      image: null
     },
]

export default function Pokedex() {
  return (
    <>
    </>
  );
}

//        <div className='tarjet'>
//            <img src={image.pokemon}></img>
//           <p>#{id.pokemon}</p>
//            <ul>
//                <li><p>Name: {pokemon.name}</p></li>
//                <li><p>Type: {pokemon.type}</p></li>
//            </ul>
//        </div>
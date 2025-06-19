import React, { useState, useEffect } from 'react';

type SearchBarProps = {
  pokemonIds: number[];
};

export default function SearchBar({ pokemonIds }: SearchBarProps) {
  const [filteredIds, setFilteredIds] = useState<number[]>(pokemonIds);

  useEffect(() => {
    setFilteredIds(pokemonIds);
  }, [pokemonIds]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilteredIds(
      pokemonIds.filter((id) => String(id).includes(value))
    );
  };

  return (
    <header className="main-header">
      <ul>
        <li>
          <a href="/" className="logo">
            <img src="/logo.png" alt="Logo" />
          </a>
        </li>
        <li>
          <input type="text" placeholder="Filtrar por ID" onChange={handleFilterChange}/>
          <svg className="magnifying-glass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
        </li>
        <li>
          <ul>
            {filteredIds.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </li>
      </ul>
    </header>
  );
}

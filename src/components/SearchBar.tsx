import React, { useState } from 'react';
import './SearchBar.css';

type SearchBarProps = {
  onSearch: (query: string) => void;
};

const logo = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/2560px-International_Pok%C3%A9mon_logo.svg.png";

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchClick = () => {
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <header className="main-header">
      <ul>
        <li>
          <a href="/" className="logo">
          <img src={logo} alt="Logo" />
          </a>
        </li>
        <li>
          <input
            type="text"
            placeholder="Buscar por nombre o ID"
            value={query}
            onChange={handleInputChange}
          />

          <button onClick={handleClear}>❌</button>

          <svg
            className="magnifying-glass"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            onClick={handleSearchClick}
          >
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
        </li>
      </ul>
    </header>
  );
}

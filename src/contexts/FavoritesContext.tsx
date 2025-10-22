import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { FavoritesContextType } from '../types';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = 'pokemon-favorites';

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const favoriteIds: number[] = JSON.parse(stored);
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites, isLoaded]);

  const addFavorite = useCallback((pokemonId: number) => {
    setFavorites(prev => {
      if (!prev.includes(pokemonId)) {
        return [...prev, pokemonId];
      }
      return prev;
    });
  }, []);

  const removeFavorite = useCallback((pokemonId: number) => {
    setFavorites(prev => prev.filter(id => id !== pokemonId));
  }, []);

  const toggleFavorite = useCallback((pokemonId: number) => {
    setFavorites(prev => {
      const isCurrentlyFavorite = prev.includes(pokemonId);
      if (isCurrentlyFavorite) {
        return prev.filter(id => id !== pokemonId);
      } else {
        return [...prev, pokemonId];
      }
    });
  }, []);

  const isFavorite = useCallback((pokemonId: number) => {
    return favorites.includes(pokemonId);
  }, [favorites]);

  const value: FavoritesContextType = {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    favoritesCount: favorites.length
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface FavoritesContextType {
  favorites: number[];
  isFavorite: (pokemonId: number) => boolean;
  addFavorite: (pokemonId: number) => void;
  removeFavorite: (pokemonId: number) => void;
  toggleFavorite: (pokemonId: number) => void;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = 'pokemon-favorites';

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      console.log('Cargando favoritos desde localStorage...');
      const stored = localStorage.getItem(STORAGE_KEY);
      console.log('Datos crudos en localStorage:', stored);
      
      if (stored) {
        const favoriteIds: number[] = JSON.parse(stored);
        console.log('Favoritos parseados:', favoriteIds);
        setFavorites(new Set(favoriteIds));
      } else {
        console.log('No hay favoritos guardados, iniciando con set vacío');
        setFavorites(new Set());
      }
    } catch (error) {
      console.error('Error cargando favoritos:', error);
      setFavorites(new Set());
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    
    try {
      const favoriteArray = Array.from(favorites);
      console.log('Guardando favoritos:', favoriteArray);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteArray));
      console.log('Favoritos guardados correctamente');
    } catch (error) {
      console.error('Error guardando favoritos:', error);
    }
  }, [favorites, isLoaded]);

  const addFavorite = useCallback((pokemonId: number) => {
    console.log('Agregando favorito:', pokemonId);
    setFavorites(prev => {
      const newSet = new Set(prev);
      newSet.add(pokemonId);
      console.log('Nuevo set de favoritos:', Array.from(newSet));
      return newSet;
    });
  }, []);

  const removeFavorite = useCallback((pokemonId: number) => {
    console.log('Removiendo favorito:', pokemonId);
    setFavorites(prev => {
      const newSet = new Set(prev);
      newSet.delete(pokemonId);
      console.log('Nuevo set de favoritos:', Array.from(newSet));
      return newSet;
    });
  }, []);

  const toggleFavorite = useCallback((pokemonId: number) => {
    console.log('Toggleando favorito:', pokemonId);
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pokemonId)) {
        newSet.delete(pokemonId);
        console.log('Removido de favoritos');
      } else {
        newSet.add(pokemonId);
        console.log('Agregado a favoritos');
      }
      console.log('Nuevo set de favoritos:', Array.from(newSet));
      return newSet;
    });
  }, []);

  const isFavorite = useCallback((pokemonId: number) => {
    const result = favorites.has(pokemonId);
    console.log(`¿Pokémon ${pokemonId} es favorito?`, result);
    return result;
  }, [favorites]);

  const value: FavoritesContextType = {
    favorites: Array.from(favorites),
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    favoritesCount: favorites.size
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

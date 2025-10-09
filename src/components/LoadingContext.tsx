import React, { createContext, useContext, useReducer, useCallback } from 'react';

interface LoadingState {
  loadingCount: number;
  requests: Map<string, boolean>;
}

type LoadingAction = 
  | { type: 'START_LOADING'; id?: string }
  | { type: 'STOP_LOADING'; id?: string }
  | { type: 'RESET_LOADING' };

interface LoadingContextType {
  isLoading: boolean;
  startLoading: (id?: string) => void;
  stopLoading: (id?: string) => void;
  resetLoading: () => void;
  withLoading: <T>(promise: Promise<T>, id?: string) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

const loadingReducer = (state: LoadingState, action: LoadingAction): LoadingState => {
  switch (action.type) {
    case 'START_LOADING':
      const newCount = state.loadingCount + 1;
      const newRequests = new Map(state.requests);
      
      if (action.id) {
        newRequests.set(action.id, true);
      }
      
      return {
        loadingCount: newCount,
        requests: newRequests
      };
    
    case 'STOP_LOADING':
      if (state.loadingCount === 0) return state;
      
      const updatedCount = Math.max(0, state.loadingCount - 1);
      const updatedRequests = new Map(state.requests);
      
      if (action.id) {
        updatedRequests.delete(action.id);
      }
      
      return {
        loadingCount: updatedCount,
        requests: updatedRequests
      };
    
    case 'RESET_LOADING':
      return {
        loadingCount: 0,
        requests: new Map()
      };
    
    default:
      return state;
  }
};

const initialState: LoadingState = {
  loadingCount: 0,
  requests: new Map()
};

const withMinimumDelay = async <T,>(promise: Promise<T>, minDelay: number = 500): Promise<T> => {
  const startTime = Date.now();
  
  const [result] = await Promise.all([
    promise,
    new Promise(resolve => setTimeout(resolve, minDelay))
  ]);
  
  const elapsed = Date.now() - startTime;
  if (elapsed < minDelay) {
    await new Promise(resolve => setTimeout(resolve, minDelay - elapsed));
  }
  
  return result;
};

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(loadingReducer, initialState);

  const startLoading = useCallback((id?: string) => {
    dispatch({ type: 'START_LOADING', id });
  }, []);

  const stopLoading = useCallback((id?: string) => {
    dispatch({ type: 'STOP_LOADING', id });
  }, []);

  const resetLoading = useCallback(() => {
    dispatch({ type: 'RESET_LOADING' });
  }, []);

  const withLoading = useCallback(async <T,>(
    promise: Promise<T>, 
    id?: string
  ): Promise<T> => {
    startLoading(id);
    try {
      const result = await withMinimumDelay(promise, 500);
      return result;
    } finally {
      stopLoading(id);
    }
  }, [startLoading, stopLoading]);

  const isLoading = state.loadingCount > 0;

  const value: LoadingContextType = {
    isLoading,
    startLoading,
    stopLoading,
    resetLoading,
    withLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

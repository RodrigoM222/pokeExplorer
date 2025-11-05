import React from 'react';
import { useLoading } from '../contexts/LoadingContext';
import LoadingIndicator from './LoadingIndicator';

export default function GlobalLoading() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <LoadingIndicator
      type="spinner"
      size="large"
      fullScreen
      message="Cargando..."
      color="#ef4444"
    />
  );
}

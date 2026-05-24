'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface Sport {
  id: number;
  name: string;
}

export function useSports() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        // En un caso real llamaríamos al backend: await api.get('/sports')
        // Por ahora lo mockeamos
        await new Promise(r => setTimeout(r, 200));
        setSports([
          { id: 1, name: 'Fútbol' },
          { id: 2, name: 'Básquetbol' },
          { id: 3, name: 'Voleibol' },
          { id: 4, name: 'Tenis' },
        ]);
      } catch (error) {
        console.error('Error fetching sports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSports();
  }, []);

  return { sports, isLoading };
}

export function usePositions(sportId: number | null) {
  const [positions, setPositions] = useState<Sport[]>([]);
  
  useEffect(() => {
    if (!sportId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPositions([]);
      return;
    }
    
    // Mock positions based on sportId
    const getPositions = () => {
      if (sportId === 1) return [{ id: 1, name: 'Portero' }, { id: 2, name: 'Defensa' }, { id: 3, name: 'Mediocampista' }, { id: 4, name: 'Delantero' }];
      if (sportId === 2) return [{ id: 5, name: 'Base' }, { id: 6, name: 'Escolta' }, { id: 7, name: 'Alero' }];
      return [{ id: 8, name: 'General' }];
    };
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPositions(getPositions());
  }, [sportId]);

  return { positions };
}
